from django.db import models

class Element(models.Model):
    atomic_number = models.PositiveIntegerField()
    symbol = models.CharField(max_length=3)
    name = models.CharField(max_length=50)
    atomic_weight = models.FloatField()
    group = models.IntegerField(null=True, blank=True)
    period = models.IntegerField(null=True, blank=True)
    category = models.CharField(max_length=50, blank=True)  # e.g., 'Noble Gas', 'Alkali Metal'
    electron_configuration = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.name} ({self.symbol})"

def load_first_10_elements():
    elements_data = [
        {"atomic_number": 1, "symbol": "H", "name": "Hydrogen", "atomic_weight": 1.008, "group": 1, "period": 1, "category": "Nonmetal", "electron_configuration": "1s1"},
        {"atomic_number": 2, "symbol": "He", "name": "Helium", "atomic_weight": 4.0026, "group": 18, "period": 1, "category": "Noble Gas", "electron_configuration": "1s2"},
        {"atomic_number": 3, "symbol": "Li", "name": "Lithium", "atomic_weight": 6.94, "group": 1, "period": 2, "category": "Alkali Metal", "electron_configuration": "[He] 2s1"},
        {"atomic_number": 4, "symbol": "Be", "name": "Beryllium", "atomic_weight": 9.0122, "group": 2, "period": 2, "category": "Alkaline Earth Metal", "electron_configuration": "[He] 2s2"},
        {"atomic_number": 5, "symbol": "B", "name": "Boron", "atomic_weight": 10.81, "group": 13, "period": 2, "category": "Metalloid", "electron_configuration": "[He] 2s2 2p1"},
        {"atomic_number": 6, "symbol": "C", "name": "Carbon", "atomic_weight": 12.011, "group": 14, "period": 2, "category": "Nonmetal", "electron_configuration": "[He] 2s2 2p2"},
        {"atomic_number": 7, "symbol": "N", "name": "Nitrogen", "atomic_weight": 14.007, "group": 15, "period": 2, "category": "Nonmetal", "electron_configuration": "[He] 2s2 2p3"},
        {"atomic_number": 8, "symbol": "O", "name": "Oxygen", "atomic_weight": 15.999, "group": 16, "period": 2, "category": "Nonmetal", "electron_configuration": "[He] 2s2 2p4"},
        {"atomic_number": 9, "symbol": "F", "name": "Fluorine", "atomic_weight": 18.998, "group": 17, "period": 2, "category": "Halogen", "electron_configuration": "[He] 2s2 2p5"},
        {"atomic_number": 10, "symbol": "Ne", "name": "Neon", "atomic_weight": 20.180, "group": 18, "period": 2, "category": "Noble Gas", "electron_configuration": "[He] 2s2 2p6"},
    ]
    for data in elements_data:
        Element.objects.get_or_create(**data)