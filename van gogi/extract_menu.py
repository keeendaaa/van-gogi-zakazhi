#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re
import json
import xml.etree.ElementTree as ET
from zipfile import ZipFile
import sys

def extract_text_from_docx(docx_path):
    """Extract text content from docx file"""
    with ZipFile(docx_path, 'r') as docx:
        xml_content = docx.read('word/document.xml').decode('utf-8')
    return xml_content

def parse_menu_items(xml_content):
    """Parse menu items from XML content"""
    # Extract all text nodes
    root = ET.fromstring(xml_content)
    
    # Find all text elements
    texts = []
    for elem in root.iter():
        if elem.tag.endswith('}t'):
            text = elem.text
            if text:
                texts.append(text)
    
    # Join all texts
    full_text = ' '.join(texts)
    
    # Pattern to find menu items
    # Format: Name, then weight, then "Цена: XXX ₽"
    items = []
    current_item = None
    
    # Split by price markers
    parts = re.split(r'(Цена:\s*\d+\s*₽)', full_text)
    
    i = 0
    while i < len(parts):
        part = parts[i].strip()
        
        # If this part contains a price
        if re.match(r'Цена:\s*\d+\s*₽', part):
            price_match = re.search(r'(\d+)', part)
            if price_match and current_item:
                current_item['price'] = int(price_match.group(1))
                items.append(current_item)
                current_item = None
        
        # Check if this might be a dish name (contains weight pattern)
        elif re.search(r'\d+\s*г', part) or re.search(r'\d+/\d+\s*г', part):
            # This might be a description (weight)
            if current_item:
                current_item['description'] = part
        else:
            # This might be a dish name
            if part and len(part) > 3 and not part.startswith('Цена'):
                # Check if it's a category header
                if any(cat in part for cat in ['Хинкали', 'Закуски', 'Салаты', 'Супы', 'Основные', 'Десерты', 'Соусы']):
                    pass  # Skip category headers
                elif current_item is None:
                    current_item = {'name': part}
        
        i += 1
    
    return items

def extract_menu_simple(xml_content):
    """Simpler extraction method"""
    # Extract text between <w:t> tags
    text_matches = re.findall(r'<w:t[^>]*>([^<]+)</w:t>', xml_content)
    
    items = []
    i = 0
    while i < len(text_matches):
        text = text_matches[i].strip()
        
        # Skip empty or very short texts
        if len(text) < 2:
            i += 1
            continue
        
        # Check if it's a price
        price_match = re.search(r'Цена:\s*(\d+)\s*₽', text)
        if price_match:
            # Look back for name and description
            if i >= 2:
                desc = text_matches[i-1].strip() if i-1 >= 0 else ''
                name = text_matches[i-2].strip() if i-2 >= 0 else ''
                
                # Validate name (should not be a weight or price)
                if name and not re.match(r'^\d+', name) and 'Цена' not in name:
                    # Check if desc is a weight
                    if re.match(r'^\d+', desc) or re.match(r'^\d+/\d+', desc):
                        items.append({
                            'name': name,
                            'description': desc,
                            'price': int(price_match.group(1))
                        })
        i += 1
    
    return items

if __name__ == '__main__':
    docx_path = 'МЕНЮ_РЕСТОРАНА_ВАН_ГОГИ_актуальное.docx'
    
    try:
        xml_content = extract_text_from_docx(docx_path)
        items = extract_menu_simple(xml_content)
        
        # Remove duplicates
        seen = set()
        unique_items = []
        for item in items:
            key = (item['name'], item['price'])
            if key not in seen:
                seen.add(key)
                unique_items.append(item)
        
        print(json.dumps(unique_items, ensure_ascii=False, indent=2))
        print(f"\nTotal items extracted: {len(unique_items)}", file=sys.stderr)
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

