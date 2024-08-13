#!/usr/bin/python3
""" Test """
from models import storage
from models.amenity import Amenity

amenities = storage.all(Amenity).values()
print(amenities)
