from fpdf import FPDF
import re

class PDF(FPDF):
    def __init__(self, title):
        super().__init__()
        self.doc_title = title

    def sanitize_text(self, text):
        # Replace specific emojis with text or empty string if needed, 
        # or just encode/decode to strip non-latin-1 chars
        return text.encode('latin-1', 'replace').decode('latin-1')

    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, self.sanitize_text(self.doc_title), 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, 'Page ' + str(self.page_no()) + '/{nb}', 0, 0, 'C')

    def chapter_title(self, label):
        self.set_font('Arial', 'B', 16)
        self.set_fill_color(200, 220, 255)
        self.cell(0, 10, self.sanitize_text(label), 0, 1, 'L', 1)
        self.ln(4)

    def chapter_subtitle(self, label):
        self.set_font('Arial', 'B', 14)
        self.cell(0, 10, self.sanitize_text(label), 0, 1, 'L')
        self.ln(2)

    def chapter_subsubtitle(self, label):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, self.sanitize_text(label), 0, 1, 'L')
        self.ln(2)

    def body_text(self, text):
        self.set_font('Arial', '', 11)
        self.multi_cell(0, 5, self.sanitize_text(text))
        self.ln()

    def code_block(self, text):
        self.set_font('Courier', '', 10)
        self.set_fill_color(240, 240, 240)
        self.multi_cell(0, 5, self.sanitize_text(text), 0, 'L', True)
        self.ln()

def convert_md_to_pdf(input_file, output_file, title="Lumina Library Document"):
    pdf = PDF(title)
    pdf.alias_nb_pages()
    pdf.add_page()
    
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    in_code_block = False
    code_buffer = []

    for line in lines:
        line = line.rstrip()
        
        # Code Blocks
        if line.startswith('```'):
            if in_code_block:
                # End of block
                pdf.code_block('\n'.join(code_buffer))
                code_buffer = []
                in_code_block = False
            else:
                # Start of block
                in_code_block = True
            continue
        
        if in_code_block:
            code_buffer.append(line)
            continue

        # Headers
        if line.startswith('# '):
            pdf.chapter_title(line[2:])
        elif line.startswith('## '):
            pdf.chapter_subtitle(line[3:])
        elif line.startswith('### '):
            pdf.chapter_subsubtitle(line[4:])
        elif line.startswith('---'):
            pdf.ln(5)
            pdf.line(10, pdf.get_y(), 200, pdf.get_y())
            pdf.ln(5)
        else:
            # Basic Bold replacement (very simple)
            line = line.replace('**', '')
            if line.strip():
                pdf.body_text(line)

    pdf.output(output_file)
    print(f"PDF generated: {output_file}")

if __name__ == '__main__':
    # Convert Beginner's Guide
    convert_md_to_pdf('BEGINNERS_GUIDE.md', 'Beginners_Guide.pdf', 'Lumina Library - Beginner\'s Guide')
    # Convert Project Report
    convert_md_to_pdf('PROJECT_REPORT.md', 'Project_Report.pdf', 'Lumina Library - Project Report')
