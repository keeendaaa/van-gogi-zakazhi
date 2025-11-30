#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re
import json
import sys
from zipfile import ZipFile

def extract_text_from_docx(docx_path):
    """Extract text content from docx file"""
    with ZipFile(docx_path, 'r') as docx:
        xml_content = docx.read('word/document.xml').decode('utf-8')
    return xml_content

def extract_menu_items(xml_content):
    """Extract menu items with better structure analysis"""
    # Extract all text with their positions
    text_elements = []
    for match in re.finditer(r'<w:t[^>]*>([^<]+)</w:t>', xml_content):
        text = match.group(1).strip()
        if text:
            text_elements.append(text)
    
    items = []
    current_category = 'mains'
    i = 0
    
    # Category mapping
    category_keywords = {
        'закуски': 'appetizers',
        'салаты': 'appetizers', 
        'супы': 'appetizers',
        'хинкали': 'mains',
        'горячие блюда': 'mains',
        'основные': 'mains',
        'десерты': 'desserts',
        'соусы': 'appetizers'
    }
    
    while i < len(text_elements):
        text = text_elements[i]
        text_lower = text.lower()
        
        # Check for category
        for keyword, cat in category_keywords.items():
            if keyword in text_lower and len(text) < 50:
                current_category = cat
                i += 1
                continue
        
        # Look for price
        if 'цена' in text_lower:
            # Extract price - can be split across multiple elements
            price_str = ''
            j = i
            while j < len(text_elements) and j < i + 3:
                price_str += text_elements[j]
                j += 1
            
            price_match = re.search(r'(\d+)', price_str)
            if price_match:
                price = int(price_match.group(1))
                
                # Look backwards for name and description
                name = ''
                desc = ''
                
                # Check previous elements (skip images, go back up to 10)
                for k in range(1, min(15, i)):
                    prev_idx = i - k
                    if prev_idx < 0:
                        break
                    
                    prev_text = text_elements[prev_idx].strip()
                    
                    # Skip empty, prices, categories
                    if not prev_text or 'цена' in prev_text.lower() or len(prev_text) < 2:
                        continue
                    
                    # Check if it's a weight/description
                    if re.match(r'^\d+', prev_text) or re.match(r'^\d+/\d+', prev_text) or 'шт' in prev_text.lower() or 'г' in prev_text:
                        if not desc:
                            desc = prev_text
                    # Check if it's a name
                    elif len(prev_text) > 3:
                        # Check if it's not a category
                        is_category = False
                        for keyword in category_keywords.keys():
                            if keyword in prev_text.lower():
                                is_category = True
                                break
                        
                        if not is_category and not name:
                            name = prev_text
                            # Try to get full name (might be split)
                            if prev_idx > 0:
                                prev_prev = text_elements[prev_idx - 1].strip()
                                if prev_prev and len(prev_prev) > 3 and not re.match(r'^\d+', prev_prev):
                                    name = prev_prev + ' ' + name
                            break
                
                # Add item if we have name and price
                if name and price > 10:  # Price should be reasonable
                    # Clean name
                    name = re.sub(r'\s+', ' ', name).strip()
                    # Skip if too short or looks like category
                    if len(name) > 5:
                        items.append({
                            'name': name,
                            'description': desc if desc else '',
                            'price': price,
                            'category': current_category
                        })
        
        i += 1
    
    # Remove duplicates
    seen = {}
    unique_items = []
    for item in items:
        # Use name and price as key, but allow same name with different prices
        key = (item['name'], item['price'])
        if key not in seen:
            seen[key] = True
            unique_items.append(item)
    
    # Sort by category then name
    category_order = {'appetizers': 0, 'mains': 1, 'desserts': 2}
    unique_items.sort(key=lambda x: (category_order.get(x['category'], 99), x['name']))
    
    return unique_items

if __name__ == '__main__':
    docx_path = 'МЕНЮ_РЕСТОРАНА_ВАН_ГОГИ_актуальное.docx'
    
    try:
        xml_content = extract_text_from_docx(docx_path)
        items = extract_menu_items(xml_content)
        
        # Output as JSON
        output = json.dumps(items, ensure_ascii=False, indent=2)
        print(output)
        print(f"\nTotal items: {len(items)}", file=sys.stderr)
        print(f"By category:", file=sys.stderr)
        cats = {}
        for item in items:
            cats[item['category']] = cats.get(item['category'], 0) + 1
        for cat, count in cats.items():
            print(f"  {cat}: {count}", file=sys.stderr)
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)

