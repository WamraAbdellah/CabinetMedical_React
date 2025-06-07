
class Patient:
    def __init__(self, nom, prenom, date_naissance, mot_de_passe, maladie, description_maladie, email, tel):
        self.nom = nom
        self.prenom = prenom
        self.date_naissance = date_naissance
        self.mot_de_passe = mot_de_passe
        self.maladie = maladie
        self.description_maladie = description_maladie
        self.email = email
        self.tel = tel
        self.role = "patient"
        self.doctor_id = None  # ID du médecin assigné

    def to_dict(self):
        return self.__dict__
