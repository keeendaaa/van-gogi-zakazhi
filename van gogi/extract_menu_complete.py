#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re
import json
import sys
from zipfile import ZipFile
import xml.etree.ElementTree as ET

def extract_text_from_docx(docx_path):
    """Extract text content from docx file"""
    with ZipFile(docx_path, 'r') as docx:
        xml_content = docx.read('word/document.xml').decode('utf-8')
    return xml_content

def extract_menu_items(xml_content):
    """Extract menu items from XML with better parsing"""
    # Extract all text nodes
    text_matches = re.findall(r'<w:t[^>]*>([^<]+)</w:t>', xml_content)
    
    items = []
    i = 0
    
    # Categories mapping
    categories = {
        'закуски': 'appetizers',
        'салаты': 'appetizers',
        'супы': 'appetizers',
        'хинкали': 'mains',
        'горячие блюда': 'mains',
        'основные': 'mains',
        'десерты': 'desserts',
        'соусы': 'appetizers'
    }
    
    current_category = 'mains'
    
    while i < len(text_matches):
        text = text_matches[i].strip()
        
        # Skip empty
        if not text or len(text) < 2:
            i += 1
            continue
        
        # Check for category headers
        text_lower = text.lower()
        for cat_key, cat_val in categories.items():
            if cat_key in text_lower and len(text) < 50:
                current_category = cat_val
                break
        
        # Look for price pattern
        if 'цена' in text_lower:
            # Try to extract price
            price_match = re.search(r'(\d+)', text)
            if price_match:
                price = int(price_match.group(1))
                
                # Look backwards for description and name
                desc = ''
                name = ''
                
                # Check previous 3-5 items
                for j in range(1, 6):
                    if i - j >= 0:
                        prev_text = text_matches[i - j].strip()
                        
                        # Check if it's a weight/description
                        if re.match(r'^\d+', prev_text) or re.match(r'^\d+/\d+', prev_text) or 'шт' in prev_text.lower():
                            if not desc:
                                desc = prev_text
                        # Check if it's a name (not price, not weight, not empty)
                        elif not re.match(r'^\d+', prev_text) and 'цена' not in prev_text.lower() and len(prev_text) > 3:
                            if not name:
                                name = prev_text
                                break
                
                # If we found name and price, add item
                if name and price > 0:
                    # Clean name
                    name = name.replace('\n', ' ').strip()
                    # Skip if it's a category or too short
                    if len(name) > 3 and name.lower() not in [k for k in categories.keys()]:
                        items.append({
                            'name': name,
                            'description': desc if desc else '',
                            'price': price,
                            'category': current_category
                        })
        
        i += 1
    
    # Remove duplicates based on name and price
    seen = {}
    unique_items = []
    for item in items:
        key = (item['name'], item['price'])
        if key not in seen:
            seen[key] = True
            unique_items.append(item)
    
    return unique_items

def extract_image_mapping(xml_content):
    """Extract mapping between images and dish names"""
    # Find image references and nearby text
    # This is complex, we'll use a simpler approach - match by order
    return {}

if __name__ == '__main__':
    docx_path = 'МЕНЮ_РЕСТОРАНА_ВАН_ГОГИ_актуальное.docx'
    
    try:
        xml_content = extract_text_from_docx(docx_path)
        items = extract_menu_items(xml_content)
        
        print(json.dumps(items, ensure_ascii=False, indent=2))
        print(f"\nTotal items extracted: {len(items)}", file=sys.stderr)
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)

