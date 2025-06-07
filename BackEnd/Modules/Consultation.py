class Consultation:
    def __init__(self, patient_id, doctor_id, date, etat="prévue", description=None):
        self.patient_id = patient_id  # ObjectId ou string
        self.doctor_id = doctor_id    # ObjectId ou string
        self.date = date              # format ISO 8601: "2025-06-04T14:30:00"
        self.etat = etat              # "prévue", "terminée", "annulée", etc.
        self.description = description

    def to_dict(self):
        return self.__dict__
