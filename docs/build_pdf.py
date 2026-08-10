from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib.utils import simpleSplit

INPUT_TEXT = "sovereign_mesh_architecture.pdf.txt"
OUTPUT_PDF = "sovereign_mesh_architecture.pdf"

PAGE_WIDTH, PAGE_HEIGHT = letter
LEFT_MARGIN = 1 * inch
RIGHT_MARGIN = 1 * inch
TOP_MARGIN = 1 * inch
BOTTOM_MARGIN = 1 * inch

FONT = "Helvetica"
FONT_SIZE = 10
LINE_SPACING = 14  # pixels


def create_pdf():
    # Load text
    with open(INPUT_TEXT, "r", encoding="utf-8") as f:
        lines = f.read().split("\n")

    # Create PDF canvas
    c = canvas.Canvas(OUTPUT_PDF, pagesize=letter)
    c.setFont(FONT, FONT_SIZE)

    # Starting position
    x = LEFT_MARGIN
    y = PAGE_HEIGHT - TOP_MARGIN

    usable_width = PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN

    for line in lines:
        # Wrap long lines automatically
        wrapped = simpleSplit(line, FONT, FONT_SIZE, usable_width)

        for wline in wrapped:
            # New page if needed
            if y < BOTTOM_MARGIN:
                c.showPage()
                c.setFont(FONT, FONT_SIZE)
                y = PAGE_HEIGHT - TOP_MARGIN

            c.drawString(x, y, wline)
            y -= LINE_SPACING

    c.save()
    print(f"PDF created: {OUTPUT_PDF}")


if __name__ == "__main__":
    create_pdf()
