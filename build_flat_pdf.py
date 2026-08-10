from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

INPUT_TEXT = "sovereign_mesh_architecture.pdf.txt"
OUTPUT_PDF = "sovereign_mesh_architecture_flat.pdf"

PAGE_WIDTH, PAGE_HEIGHT = letter
LINE_SPACING = 12  # tighter spacing for flat layout

def create_flat_pdf():
    with open(INPUT_TEXT, "r", encoding="utf-8") as f:
        lines = f.read().split("\n")

    c = canvas.Canvas(OUTPUT_PDF, pagesize=letter)
    c.setFont("Helvetica", 10)

    x = 0  # no margin
    y = PAGE_HEIGHT  # start at top

    for line in lines:
        y -= LINE_SPACING
        c.drawString(x, y, line)

        # If text runs off the page, continue anyway (flat mode)
        # No page breaks, no wrapping

    c.save()
    print(f"Flattened PDF created: {OUTPUT_PDF}")

if __name__ == "__main__":
    create_flat_pdf()
