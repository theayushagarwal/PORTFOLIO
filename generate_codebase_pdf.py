import os
import sys
from fpdf import FPDF

class CodebasePDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, 'PORTFOLIO CODEBASE DOCUMENTATION | THEAYUSH.PAGES.DEV', border=False, align='L')
        self.cell(0, 8, 'PAGE ' + str(self.page_no()), border=False, align='R')
        self.ln(10)
        self.set_draw_color(220, 220, 220)
        self.line(10, 18, 200, 18)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(140, 140, 140)
        self.cell(0, 10, 'Generated for Ayush Agarwal Portfolio Codebase (Excluding Binary & Build Artifacts)', align='C')

def generate_pdf():
    project_root = r"c:\Users\ayush\Downloads\portfolio-redesigned (2)\portfolio"
    output_pdf_path = os.path.join(project_root, "portfolio_codebase_complete.pdf")

    # Excluded directories
    exclude_dirs = {
        'node_modules', '.git', '.output', 'dist', '.wrangler', 
        '.impeccable', '.agents', '.nitro', 'scratch', 'brain'
    }

    # Excluded extensions
    exclude_exts = {
        '.png', '.jpg', '.jpeg', '.webp', '.ico', '.woff', '.woff2', 
        '.ttf', '.eot', '.mp3', '.wav', '.pdf', '.zip', '.tar', '.gz', 
        '.lock', '.exe', '.bin', '.db', '.sqlite'
    }

    # Specific excluded files
    exclude_files = {'package-lock.json', 'skills-lock.json', 'portfolio_codebase_complete.pdf'}

    files_to_process = []

    for root, dirs, files in os.walk(project_root):
        # Prune excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]

        for file in sorted(files):
            if file in exclude_files:
                continue
            ext = os.path.splitext(file)[1].lower()
            if ext in exclude_exts:
                continue
            
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, project_root)
            
            # Skip if file size > 300KB (e.g. huge minified bundles)
            if os.path.getsize(full_path) > 300 * 1024:
                continue

            files_to_process.append((rel_path, full_path))

    files_to_process.sort(key=lambda x: x[0])

    print(f"Total source files to compile into PDF: {len(files_to_process)}")

    pdf = CodebasePDF(orientation='P', unit='mm', format='A4')
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Cover / Title Section
    pdf.set_font('Helvetica', 'B', 22)
    pdf.set_text_color(15, 23, 42) # Slate 900
    pdf.cell(0, 14, 'Portfolio Codebase Documentation', ln=True, align='C')
    
    pdf.set_font('Helvetica', '', 12)
    pdf.set_text_color(100, 116, 139) # Slate 500
    pdf.cell(0, 8, 'Complete Source Code Bundle (React 19, TanStack Start, Tailwind, Nitro)', ln=True, align='C')
    pdf.cell(0, 8, f'Total Included Source Files: {len(files_to_process)}', ln=True, align='C')
    pdf.ln(10)

    # Table of Contents Summary Box
    pdf.set_fill_color(241, 245, 249) # Slate 100
    pdf.set_draw_color(203, 213, 225)
    pdf.set_font('Helvetica', 'B', 11)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 10, '   INCLUDED FILE DIRECTORY:', ln=True, fill=True, border=1)
    
    pdf.set_font('Courier', '', 8)
    pdf.set_text_color(51, 65, 85)
    
    for rel_path, _ in files_to_process:
        pdf.cell(0, 5, f'   - {rel_path}', ln=True)

    pdf.add_page()

    # Process each file
    for idx, (rel_path, full_path) in enumerate(files_to_process, 1):
        print(f"[{idx}/{len(files_to_process)}] Adding {rel_path}...")
        
        pdf.set_font('Helvetica', 'B', 13)
        pdf.set_text_color(15, 23, 42)
        pdf.set_fill_color(226, 232, 240)
        pdf.cell(0, 10, f' FILE #{idx}: {rel_path}', ln=True, fill=True, border=1)
        pdf.ln(3)

        try:
            with open(full_path, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()

            lines = content.splitlines()
            pdf.set_font('Courier', '', 7.5)
            pdf.set_text_color(30, 41, 59)

            for line_num, line_text in enumerate(lines, 1):
                # Format line with line number
                # Sanitize tabs
                line_clean = line_text.replace('\t', '    ')
                # Escape characters if needed (fpdf handles basic latin-1 / utf8)
                formatted_line = f"{line_num:4d} | {line_clean}"
                
                # Truncate very wide lines to avoid overflow
                if len(formatted_line) > 115:
                    formatted_line = formatted_line[:112] + "..."

                # Encode to latin-1 safe string for fpdf
                safe_line = formatted_line.encode('latin-1', 'replace').decode('latin-1')
                pdf.cell(0, 4, safe_line, ln=True)

            pdf.ln(8)

        except Exception as e:
            pdf.set_font('Helvetica', 'I', 9)
            pdf.set_text_color(220, 38, 38)
            pdf.cell(0, 6, f"[Error reading file: {str(e)}]", ln=True)
            pdf.ln(5)

    pdf.output(output_pdf_path)
    print(f"\nSUCCESS! PDF generated successfully at:\n{output_pdf_path}")

if __name__ == "__main__":
    generate_pdf()
