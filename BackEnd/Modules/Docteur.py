from Constantes import specialites
class Docteur:
    def __init__(self, nom, prenom, email, specialite, mot_de_passe, tel,created_at):
        if specialite not in specialites:
            raise ValueError("Spécialité invalide")

        self.nom = nom
        self.prenom = prenom
        self.email = email
        self.specialite = specialite
        self.mot_de_passe = mot_de_passe
        self.tel = tel
        self.role = "doctor"
        self.patient_ids = []
        self.created_at = created_at

    def to_dict(self):
        return self.__dict__
