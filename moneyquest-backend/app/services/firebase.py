import firebase_admin
from firebase_admin import credentials, firestore
import os

# Mock Firebase for development if credentials not found
class MockFirestore:
    def __init__(self):
        self.db = {}

    def collection(self, name):
        if name not in self.db:
            self.db[name] = {}
        return MockCollection(self.db[name])

class MockCollection:
    def __init__(self, data):
        self.data = data

    def document(self, doc_id=None):
        return MockDocument(self.data, doc_id)

    def where(self, field, op, value):
        # Very limited mock where
        return self

    def stream(self):
        return [MockDocSnapshot(k, v) for k, v in self.data.items()]

class MockDocument:
    def __init__(self, data, doc_id=None):
        self.data = data
        self.id = doc_id or "mock_id"

    def set(self, doc_data):
        self.data[self.id] = doc_data

    def get(self):
        return MockDocSnapshot(self.id, self.data.get(self.id))

    def update(self, doc_data):
        if self.id in self.data:
            self.data[self.id].update(doc_data)

class MockDocSnapshot:
    def __init__(self, doc_id, data):
        self.id = doc_id
        self._data = data
        self.exists = data is not None

    def to_dict(self):
        return self._data

try:
    if os.path.exists("serviceAccount.json"):
        cred = credentials.Certificate("serviceAccount.json")
        firebase_admin.initialize_app(cred)
        db = firestore.client()
    else:
        print("Firebase credentials not found, using Mock DB")
        db = MockFirestore()
except Exception as e:
    print(f"Error initializing Firebase: {e}, using Mock DB")
    db = MockFirestore()

def get_db():
    return db
