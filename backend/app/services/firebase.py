from datetime import datetime

# In-memory mock database
MOCK_DB = {
    "users": {},
    "records": [],
    "quests": [],
    "guilds": {}
}

class MockFirestore:
    def collection(self, name):
        return MockCollection(name)

class MockCollection:
    def __init__(self, name):
        self.name = name

    def document(self, doc_id):
        return MockDocument(self.name, doc_id)

    def add(self, data):
        # Generate simple ID
        doc_id = f"{self.name}_{int(datetime.now().timestamp())}"
        if self.name == "records":
            data["id"] = doc_id
            MOCK_DB[self.name].append(data)
        elif self.name in MOCK_DB:
             MOCK_DB[self.name][doc_id] = data
        return None, MockDocumentReference(doc_id)
        
    def stream(self):
        if self.name == "records":
            for item in MOCK_DB[self.name]:
                yield MockSnapshot(item)
        elif self.name in MOCK_DB:
            for k, v in MOCK_DB[self.name].items():
                v["id"] = k
                yield MockSnapshot(v)

class MockDocument:
    def __init__(self, col_name, doc_id):
        self.col_name = col_name
        self.doc_id = doc_id

    def set(self, data, merge=False):
        if self.col_name in MOCK_DB:
             if isinstance(MOCK_DB[self.col_name], dict):
                if merge and self.doc_id in MOCK_DB[self.col_name]:
                    MOCK_DB[self.col_name][self.doc_id].update(data)
                else:
                    MOCK_DB[self.col_name][self.doc_id] = data

    def get(self):
        data = None
        if self.col_name in MOCK_DB and isinstance(MOCK_DB[self.col_name], dict):
            data = MOCK_DB[self.col_name].get(self.doc_id)
        return MockSnapshot(data) if data else MockSnapshot(None, exists=False)
        
    def update(self, data):
        self.set(data, merge=True)

class MockDocumentReference:
    def __init__(self, id):
        self.id = id

class MockSnapshot:
    def __init__(self, data, exists=True):
        self._data = data
        self.exists = exists
        self.id = data.get("id") if data else "unknown"

    def to_dict(self):
        return self._data

# Initialize DB (Mock or Real)
# For production, utilize firebase_admin.credentials and firestore.client()
db = MockFirestore()

def get_db():
    return db
