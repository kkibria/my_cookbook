import os
import argparse
from jinja2 import Environment, FileSystemLoader, Template

def process_markdown_file(md_path: str, template: Template):
    # Read markdown file
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Find first non-empty line (the heading)
    heading_line = None
    rest_lines_start = 0
    for idx, line in enumerate(lines):
        if line.strip():
            heading_line = line.strip()
            rest_lines_start = idx + 1
            break

    if heading_line is None:
        # No content in file
        return

    # Skip files where first non-empty line contains '---'
    if '---' in heading_line:
        return

    # Extract heading text, removing leading '#' and whitespace
    heading_text = heading_line.lstrip('#').strip()

    # Render template with heading
    rendered = template.render(title=heading_text)

    # Write back: template content + remaining lines
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(rendered)
        # Ensure original spacing
        if rest_lines_start < len(lines):
            f.write(''.join(lines[rest_lines_start:]))


def main(folder: str, template_path: str):
    # Set up Jinja environment
    template_dir, template_file = os.path.split(template_path)
    env = Environment(
        loader=FileSystemLoader(searchpath=template_dir or './'),
        autoescape=False
    )
    template = env.get_template(template_file)

    # Walk through directory recursively
    for root, dirs, files in os.walk(folder):
        for file in files:
            if file.lower().endswith('.md'):
                md_path = os.path.join(root, file)
                process_markdown_file(md_path, template)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Apply a Jinja template to all markdown files in a directory tree, replacing the first heading.')
    parser.add_argument('folder', help='Root folder to search for .md files')
    parser.add_argument('template', help='Path to the Jinja template file')
    args = parser.parse_args()
    main(args.folder, args.template)
