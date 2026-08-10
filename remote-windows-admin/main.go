package main

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"
	"unsafe"
)

// Obfuscated GitHub PAT placeholder.
// The user MUST replace this byte array with their own XOR'd PAT before production!
var obfuscatedPAT = []byte{0x00, 0x00, 0x00, 0x00}
var xorKey = []byte("SOS_SECRET_KEY")

func decryptPAT() string {
	// If it's just the placeholder, don't return anything
	if len(obfuscatedPAT) == 0 || (len(obfuscatedPAT) == 4 && obfuscatedPAT[0] == 0x00) {
		return ""
	}
	decrypted := make([]byte, len(obfuscatedPAT))
	for i := range obfuscatedPAT {
		decrypted[i] = obfuscatedPAT[i] ^ xorKey[i%len(xorKey)]
	}
	return string(decrypted)
}

func generateShortcode(length int) string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, length)
	for i := range b {
		n, _ := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		b[i] = charset[n.Int64()]
	}
	return string(b)
}

func isElevated() bool {
	f, err := os.Open("\\\\.\\PHYSICALDRIVE0")
	if err != nil {
		return false
	}
	f.Close()
	return true
}

func relaunchAsAdmin(exePath string) {
	shell32 := syscall.NewLazyDLL("shell32.dll")
	shellExecute := shell32.NewProc("ShellExecuteW")

	verb, _ := syscall.UTF16PtrFromString("runas")
	exe, _ := syscall.UTF16PtrFromString(exePath)
	cwd, _ := syscall.UTF16PtrFromString("")
	
	// Reconstruct arguments
	argsStr := strings.Join(os.Args[1:], " ")
	args, _ := syscall.UTF16PtrFromString(argsStr)

	ret, _, _ := shellExecute.Call(
		0,
		uintptr(unsafe.Pointer(verb)),
		uintptr(unsafe.Pointer(exe)),
		uintptr(unsafe.Pointer(args)),
		uintptr(unsafe.Pointer(cwd)),
		1, // SW_NORMAL
	)
	if ret <= 32 {
		os.Exit(1)
	}
	os.Exit(0)
}

func main() {
	exePath, err := os.Executable()
	if err != nil {
		fmt.Printf("Error resolving executable path: %v\n", err)
		os.Exit(1)
	}

	exeDir := filepath.Dir(exePath)
	scriptPath := filepath.Join(exeDir, "setup.ps1")

	if !isElevated() {
		relaunchAsAdmin(exePath)
	}

	// Generate 5-character Installation ID shortcode
	installationID := generateShortcode(5)
	os.Setenv("INSTALLATION_ID", installationID)

	// Decrypt PAT and inject into environment
	pat := decryptPAT()
	if pat != "" {
		os.Setenv("GITHUB_TOKEN", pat)
	}

	// Pass all arguments down to setup.ps1
	args := []string{"-NoProfile", "-ExecutionPolicy", "Bypass", "-File", scriptPath}
	args = append(args, os.Args[1:]...)

	cmd := exec.Command("powershell.exe", args...)
	logFile, _ := os.OpenFile("C:\\ProgramData\\setup_output.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if logFile != nil {
		defer logFile.Close()
		cmd.Stdout = logFile
		cmd.Stderr = logFile
	} else {
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
	}
	cmd.Stdin = os.Stdin
	cmd.Env = os.Environ() // Ensure inherited env including injected vars

	err = cmd.Run()
	
	f, _ := os.OpenFile("C:\\ProgramData\\setup_error.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if f != nil {
		f.WriteString(fmt.Sprintf("Error launching setup.ps1: %v\n", err))
		if err != nil {
			if exitError, ok := err.(*exec.ExitError); ok {
				f.WriteString(fmt.Sprintf("Exit Code: %d\n", exitError.ExitCode()))
			}
		}
		f.Close()
	}

	fmt.Printf("\n--- SETUP PROCESS ENDED ---\n")
	if err != nil {
		fmt.Printf("PowerShell exited with error: %v\n", err)
	} else {
		fmt.Printf("PowerShell exited successfully.\n")
	}
	exec.Command("cmd.exe", "/c", "pause").Run()

	if err != nil {
		if exitError, ok := err.(*exec.ExitError); ok {
			os.Exit(exitError.ExitCode())
		}
		os.Exit(1)
	}
}
