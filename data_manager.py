import json
import os
from datetime import datetime

DATA_DIR = 'data'

class DataManager:
    def __init__(self):
        self.books_file = os.path.join(DATA_DIR, 'books.json')
        self.members_file = os.path.join(DATA_DIR, 'members.json')
        self.issued_file = os.path.join(DATA_DIR, 'issued.json')
        self._ensure_files_exist()

    def _ensure_files_exist(self):
        for f in [self.books_file, self.members_file, self.issued_file]:
            if not os.path.exists(f):
                with open(f, 'w') as file:
                    json.dump([], file)

    def _read_json(self, filepath):
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def _write_json(self, filepath, data):
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)

    # --- BOOKS ---
    def get_all_books(self):
        return self._read_json(self.books_file)

    def add_book(self, book_data):
        books = self.get_all_books()
        new_id = 101 if not books else max(b['id'] for b in books) + 1
        book_data['id'] = new_id
        book_data['available_copies'] = int(book_data['total_copies'])
        books.append(book_data)
        self._write_json(self.books_file, books)
        return book_data

    def get_book_by_id(self, book_id):
        books = self.get_all_books()
        return next((b for b in books if b['id'] == book_id), None)

    def update_book_stock(self, book_id, change):
        books = self.get_all_books()
        for book in books:
            if book['id'] == book_id:
                book['available_copies'] += change
                self._write_json(self.books_file, books)
                return True
        return False

    # --- MEMBERS ---
    def get_all_members(self):
        return self._read_json(self.members_file)

    def add_member(self, member_data):
        members = self.get_all_members()
        # Simple ID generation logic for demo
        count = len(members) + 1
        year = datetime.now().year
        new_id = f"M-{year}-{count:03d}"
        
        member_data['id'] = new_id
        member_data['joined_date'] = datetime.now().strftime("%Y-%m-%d")
        members.append(member_data)
        self._write_json(self.members_file, members)
        return member_data

    # --- ISSUES ---
    def get_all_issues(self):
        return self._read_json(self.issued_file)

    def issue_book(self, book_id, member_id):
        book = self.get_book_by_id(book_id)
        if not book or book['available_copies'] < 1:
            return {"error": "Book unavailable"}

        issues = self.get_all_issues()
        new_id = 5001 if not issues else max(i['id'] for i in issues) + 1
        
        # Calculate due date (14 days from now)
        from datetime import timedelta
        issue_date = datetime.now()
        due_date = issue_date + timedelta(days=14)

        new_issue = {
            "id": new_id,
            "book_id": book_id,
            "member_id": member_id,
            "issue_date": issue_date.strftime("%Y-%m-%d"),
            "due_date": due_date.strftime("%Y-%m-%d"),
            "status": "issued"
        }

        issues.append(new_issue)
        self._write_json(self.issued_file, issues)
        self.update_book_stock(book_id, -1)
        return new_issue

    def return_book(self, issue_id):
        issues = self.get_all_issues()
        for issue in issues:
            if issue['id'] == issue_id and issue['status'] == 'issued':
                issue['status'] = 'returned'
                issue['return_date'] = datetime.now().strftime("%Y-%m-%d")
                self._write_json(self.issued_file, issues)
                self.update_book_stock(issue['book_id'], 1)
                return issue
        return {"error": "Issue record not found or already returned"}

    def get_stats(self):
        books = self.get_all_books()
        issues = self.get_all_issues()
        
        total_books = sum(int(b['total_copies']) for b in books)
        active_issues = sum(1 for i in issues if i['status'] == 'issued')
        
        # Simple overdue check
        overdue = 0
        today = datetime.now().strftime("%Y-%m-%d")
        for i in issues:
            if i['status'] == 'issued' and i['due_date'] < today:
                overdue += 1

        # Chart Data (Last 7 Days)
        from datetime import timedelta
        chart_labels = []
        chart_data = []
        
        for i in range(6, -1, -1):
            date = datetime.now() - timedelta(days=i)
            date_str = date.strftime("%Y-%m-%d")
            day_name = date.strftime("%a")
            
            count = sum(1 for issue in issues if issue['issue_date'] == date_str)
            
            chart_labels.append(day_name)
            chart_data.append(count)

        return {
            "total_books": total_books,
            "active_issues": active_issues,
            "overdue_books": overdue,
            "chart": {
                "labels": chart_labels,
                "data": chart_data
            }
        }
