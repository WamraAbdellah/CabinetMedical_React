class Admin:
    def __init__(self, nom, prenom, email, mot_de_passe):
        self.nom = nom
        self.prenom = prenom
        self.email = email
        self.mot_de_passe = mot_de_passe
        self.role = "admin"

    def to_dict(self):
        return self.__dict__
