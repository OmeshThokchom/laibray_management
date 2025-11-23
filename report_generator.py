from fpdf import FPDF
from datetime import datetime

class PDFReport(FPDF):
    def header(self):
        # Logo
        # self.image('logo.png', 10, 8, 33)
        # Font
        self.set_font('Arial', 'B', 15)
        # Title
        self.cell(80)
        self.cell(30, 10, 'Lumina Library Report', 0, 0, 'C')
        # Line break
        self.ln(20)

    def footer(self):
        # Position at 1.5 cm from bottom
        self.set_y(-15)
        # Arial italic 8
        self.set_font('Arial', 'I', 8)
        # Page number
        self.cell(0, 10, 'Page ' + str(self.page_no()) + '/{nb}', 0, 0, 'C')

    def chapter_title(self, label):
        self.set_font('Arial', 'B', 12)
        self.set_fill_color(200, 220, 255)
        self.cell(0, 6, label, 0, 1, 'L', 1)
        self.ln(4)

    def chapter_body(self, body):
        self.set_font('Arial', '', 12)
        self.multi_cell(0, 5, body)
        self.ln()

def generate_report(stats, books, members, issues):
    pdf = PDFReport()
    pdf.alias_nb_pages()
    pdf.add_page()
    
    # Timestamp
    pdf.set_font('Arial', 'I', 10)
    pdf.cell(0, 10, f'Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', 0, 1)
    pdf.ln(5)

    # Stats
    pdf.chapter_title('Library Statistics')
    stats_text = (
        f"Total Books: {stats['total_books']}\n"
        f"Total Members: {stats['total_members']}\n"
        f"Active Issues: {stats['active_issues']}\n"
        f"Overdue Books: {stats['overdue']}"
    )
    pdf.chapter_body(stats_text)

    # Issued Books
    pdf.chapter_title('Currently Issued Books')
    if not issues:
        pdf.chapter_body("No books currently issued.")
    else:
        for issue in issues:
            if issue['status'] == 'issued':
                line = f"Book ID: {issue['book_id']} | Member: {issue['member_id']} | Due: {issue['due_date']}"
                pdf.chapter_body(line)

    # Books Inventory (Summary)
    pdf.chapter_title('Inventory Snapshot')
    for book in books[:10]: # Limit to 10 for demo
        line = f"[{book['id']}] {book['title']} - {book['available_copies']}/{book['total_copies']} copies"
        pdf.chapter_body(line)
    
    if len(books) > 10:
        pdf.chapter_body(f"...and {len(books)-10} more books.")

    return pdf
