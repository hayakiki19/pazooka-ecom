from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import random
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

TEE_SIZES = ["S", "M", "L", "XL", "XXL"]
CAP_SIZES = ["OS"]

OVERSIZED_DESC = "Heavyweight {gsm} cotton jersey with dropped shoulders and a boxy, street-ready silhouette. Garment-dyed, pre-shrunk and built to outlast every trend cycle."
REGULAR_DESC = "Clean tailored cut in breathable {gsm} combed cotton. Ribbed collar, side-seamed construction, everyday armour for the city."
CAP_DESC = "Structured crown with embroidered PAZOOKA branding. Adjustable closure, one-size-fits-most. The finishing hit for any fit."

def P(id_, name, category, fit, price, original, tag, gsm, color, desc_tpl, img, alt):
    return {
        "id": id_, "name": name, "category": category, "fit": fit,
        "price": price, "original_price": original, "tag": tag, "gsm": gsm,
        "color": color, "description": desc_tpl.format(gsm=gsm) if gsm else desc_tpl,
        "sizes": CAP_SIZES if category == "caps" else TEE_SIZES,
        "images": [img, alt],
    }

U = "https://images.unsplash.com/"
X = "https://images.pexels.com/photos/"

PRODUCTS = [
    P("paz-01", "CYBERNETIC ACID OVERSIZED TEE", "oversized", "Oversized", 49, 65, "NEW DROP", "280 GSM", "Acid Black", OVERSIZED_DESC,
      U + "photo-1635650804060-bb009bcb2ea5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHszfHx1cmJhbiUyMHN0cmVldHdlYXIlMjBtb2RlbCUyMG92ZXJzaXplZCUyMHRzaGlydCUyMGZhc2hpb24lMjBlZGl0b3JpYWx8ZW58MHx8fHwxNzg5ODU0MTAyfDA&ixlib=rb-4.1.0&q=75&w=800",
      X + "18584221/pexels-photo-18584221.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=650&w=940"),
    P("paz-02", "NEON METROPOLIS GRAPHIC TEE", "oversized", "Oversized", 54, None, "LIMITED", "300 GSM", "Concrete Grey", OVERSIZED_DESC,
      U + "photo-1721637686340-de9f8cebda5a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHN0cmVldHdlYXIlMjBtb2RlbCUyMG92ZXJzaXplZCUyMHRzaGlydCUyMGZhc2hpb24lMjBlZGl0b3JpYWx8ZW58MHx8fHwxNzg5ODU0MTAyfDA&ixlib=rb-4.1.0&q=75&w=800",
      U + "photo-1721637635502-b0abaaa75edb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwyfHx1cmJhbiUyMHN0cmVldHdlYXIlMjBtb2RlbCUyMG92ZXJzaXplZCUyMHRzaGlydCUyMGZhc2hpb24lMjBlZGl0b3JpYWx8ZW58MHx8fHwxNzg5ODU0MTAyfDA&ixlib=rb-4.1.0&q=75&w=800"),
    P("paz-03", "UNRULY ARCHIVE RELAXED FIT TEE", "oversized", "Oversized", 45, 55, "BESTSELLER", "280 GSM", "Bone White", OVERSIZED_DESC,
      U + "photo-1535487958887-032fb5767ade?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHw0fHx1cmJhbiUyMHN0cmVldHdlYXIlMjBtb2RlbCUyMG92ZXJzaXplZCUyMHRzaGlydCUyMGZhc2hpb24lMjBlZGl0b3JpYWx8ZW58MHx8fHwxNzg5ODU0MTAyfDA&ixlib=rb-4.1.0&q=75&w=800",
      X + "32819862/pexels-photo-32819862.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=650&w=940"),
    P("paz-04", "TOXIC MATRIX HEAVY COTTON TEE", "oversized", "Oversized", 52, None, "NEW DROP", "280 GSM", "Asphalt", OVERSIZED_DESC,
      X + "32819862/pexels-photo-32819862.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=650&w=940",
      U + "photo-1635650804060-bb009bcb2ea5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHszfHx1cmJhbiUyMHN0cmVldHdlYXIlMjBtb2RlbCUyMG92ZXJzaXplZCUyMHRzaGlydCUyMGZhc2hpb24lMjBlZGl0b3JpYWx8ZW58MHx8fHwxNzg5ODU0MTAyfDA&ixlib=rb-4.1.0&q=75&w=800"),
    P("paz-05", "RAW MONOCHROME PUFF PRINT TEE", "oversized", "Oversized", 48, 60, "HOT", "280 GSM", "Off Black", OVERSIZED_DESC,
      U + "photo-1646197879186-2add4e5225a6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHszfHxzdHJlZXR3ZWFyJTIwYXBwYXJlbCUyMGNsb3RoaW5nJTIwaG9vZGllJTIwY2FwJTIwbW9kZWwlMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwwfHx8fDE3ODk4NTQxMDJ8MA&ixlib=rb-4.1.0&q=75&w=800",
      U + "photo-1646197879190-78a962aab29b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHw0fHxzdHJlZXR3ZWFyJTIwYXBwYXJlbCUyMGNsb3RoaW5nJTIwaG9vZGllJTIwY2FwJTIwbW9kZWwlMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwwfHx8fDE3ODk4NTQxMDJ8MA&ixlib=rb-4.1.0&q=75&w=800"),
    P("paz-06", "BRUTALIST ARCHITECTURE TEE", "oversized", "Oversized", 50, None, "NEW DROP", "280 GSM", "Washed Stone", OVERSIZED_DESC,
      U + "photo-1669266586576-639523db9306?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwYXBwYXJlbCUyMGNsb3RoaW5nJTIwaG9vZGllJTIwY2FwJTIwbW9kZWwlMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwwfHx8fDE3ODk4NTQxMDJ8MA&ixlib=rb-4.1.0&q=75&w=800",
      U + "photo-1721664705833-eec0584e7222?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwyfHxzdHJlZXR3ZWFyJTIwYXBwYXJlbCUyMGNsb3RoaW5nJTIwaG9vZGllJTIwY2FwJTIwbW9kZWwlMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwwfHx8fDE3ODk4NTQxMDJ8MA&ixlib=rb-4.1.0&q=75&w=800"),
    P("paz-07", "UNDERGROUND DRIFT VINTAGE WASH TEE", "oversized", "Oversized", 56, 70, "LIMITED", "320 GSM", "Vintage Coal", OVERSIZED_DESC,
      X + "14241847/pexels-photo-14241847.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=650&w=940",
      X + "28701960/pexels-photo-28701960.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=650&w=940"),
    P("paz-08", "ACID WAVE DISTRESSED TEE", "oversized", "Oversized", 46, None, "POPULAR", "280 GSM", "Static White", OVERSIZED_DESC,
      X + "28701960/pexels-photo-28701960.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=650&w=940",
      X + "14241847/pexels-photo-14241847.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=650&w=940"),
    P("paz-09", "SIGNAL NOISE EMBROIDERED TEE", "oversized", "Oversized", 55, 68, "LIMITED", "280 GSM", "Midnight", OVERSIZED_DESC,
      U + "photo-1532332248682-206cc786359f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHszfHxzdHJlZXR3ZWFyJTIwYmFzZWJhbGwlMjBjYXAlMjBiZWFuaWUlMjBoYXQlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MHx8fHwxNzg5ODU0MTA4fDA&ixlib=rb-4.1.0&q=75&w=800",
      U + "photo-1635650804483-2a77a8c9e728?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHxfHxzdHJlZXR3ZWFyJTIwYmFzZWJhbGwlMjBjYXAlMjBiZWFuaWUlMjBoYXQlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MHx8fHwxNzg5ODU0MTA4fDA&ixlib=rb-4.1.0&q=75&w=800"),
    P("paz-10", "PAZOOKA ZERO HOUR BOX TEE", "oversized", "Oversized", 42, 50, "NEW DROP", "280 GSM", "Chalk", OVERSIZED_DESC,
      U + "photo-1635650804483-2a77a8c9e728?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHxfHxzdHJlZXR3ZWFyJTIwYmFzZWJhbGwlMjBjYXAlMjBiZWFuaWUlMjBoYXQlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MHx8fHwxNzg5ODU0MTA4fDA&ixlib=rb-4.1.0&q=75&w=800",
      U + "photo-1532332248682-206cc786359f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHszfHxzdHJlZXR3ZWFyJTIwYmFzZWJhbGwlMjBjYXAlMjBiZWFuaWUlMjBoYXQlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MHx8fHwxNzg5ODU0MTA4fDA&ixlib=rb-4.1.0&q=75&w=800"),
    P("paz-11", "ESSENTIAL LOGO REGULAR TEE - WHITE", "regular", "Regular Fit", 38, 45, "CORE", "240 GSM", "White", REGULAR_DESC,
      U + "photo-1523380744952-b7e00e6e2ffa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxzdHJlZXR3ZWFyJTIwYmFzZWJhbGwlMjBjYXAlMjBiZWFuaWUlMjBoYXQlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MHx8fHwxNzg5ODU0MTA4fDA&ixlib=rb-4.1.0&q=75&w=800",
      U + "photo-1574427797991-b086946fa9e7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHxzdHJlZXR3ZWFyJTIwYmFzZWJhbGwlMjBjYXAlMjBiZWFuaWUlMjBoYXQlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MHx8fHwxNzg5ODU0MTA4fDA&ixlib=rb-4.1.0&q=75&w=800"),
    P("paz-12", "ESSENTIAL LOGO REGULAR TEE - BLACK", "regular", "Regular Fit", 38, None, "CORE", "240 GSM", "Black", REGULAR_DESC,
      U + "photo-1574427797991-b086946fa9e7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHxzdHJlZXR3ZWFyJTIwYmFzZWJhbGwlMjBjYXAlMjBiZWFuaWUlMjBoYXQlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MHx8fHwxNzg5ODU0MTA4fDA&ixlib=rb-4.1.0&q=75&w=800",
      U + "photo-1523380744952-b7e00e6e2ffa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxzdHJlZXR3ZWFyJTIwYmFzZWJhbGwlMjBjYXAlMjBiZWFuaWUlMjBoYXQlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MHx8fHwxNzg5ODU0MTA4fDA&ixlib=rb-4.1.0&q=75&w=800"),
    P("paz-13", "KINETIC TYPE FIT TEE", "regular", "Regular Fit", 40, 48, "POPULAR", "240 GSM", "Ash Grey", REGULAR_DESC,
      X + "35515095/pexels-photo-35515095.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=650&w=940",
      X + "15752006/pexels-photo-15752006.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=650&w=940"),
    P("paz-14", "URBAN CONCRETE TAILORED TEE", "regular", "Regular Fit", 42, None, "NEW", "250 GSM", "Concrete", REGULAR_DESC,
      X + "15752006/pexels-photo-15752006.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=650&w=940",
      X + "35515095/pexels-photo-35515095.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=650&w=940"),
    P("paz-15", "ACID ACCENT GRAPHIC TEE", "regular", "Regular Fit", 44, 52, "HOT", "240 GSM", "Black / Acid", REGULAR_DESC,
      U + "photo-1646197879186-2add4e5225a6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHszfHxzdHJlZXR3ZWFyJTIwYXBwYXJlbCUyMGNsb3RoaW5nJTIwaG9vZGllJTIwY2FwJTIwbW9kZWwlMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwwfHx8fDE3ODk4NTQxMDJ8MA&ixlib=rb-4.1.0&q=75&w=800",
      U + "photo-1646197879190-78a962aab29b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHw0fHxzdHJlZXR3ZWFyJTIwYXBwYXJlbCUyMGNsb3RoaW5nJTIwaG9vZGllJTIwY2FwJTIwbW9kZWwlMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwwfHx8fDE3ODk4NTQxMDJ8MA&ixlib=rb-4.1.0&q=75&w=800"),
    P("paz-16", "SIGNATURE EMBLEM FITTED TEE", "regular", "Regular Fit", 36, None, "CORE", "240 GSM", "Ecru", REGULAR_DESC,
      U + "photo-1669266586576-639523db9306?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwYXBwYXJlbCUyMGNsb3RoaW5nJTIwaG9vZGllJTIwY2FwJTIwbW9kZWwlMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwwfHx8fDE3ODk4NTQxMDJ8MA&ixlib=rb-4.1.0&q=75&w=800",
      U + "photo-1721664705833-eec0584e7222?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwyfHxzdHJlZXR3ZWFyJTIwYXBwYXJlbCUyMGNsb3RoaW5nJTIwaG9vZGllJTIwY2FwJTIwbW9kZWwlMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwwfHx8fDE3ODk4NTQxMDJ8MA&ixlib=rb-4.1.0&q=75&w=800"),
    P("paz-17", "PAZOOKA EMBROIDERED TRUCKER CAP", "caps", "Adjustable", 28, 35, "BESTSELLER", None, "Black / White", CAP_DESC,
      U + "photo-1523380744952-b7e00e6e2ffa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxzdHJlZXR3ZWFyJTIwYmFzZWJhbGwlMjBjYXAlMjBiZWFuaWUlMjBoYXQlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MHx8fHwxNzg5ODU0MTA4fDA&ixlib=rb-4.1.0&q=75&w=800",
      U + "photo-1574427797991-b086946fa9e7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHxzdHJlZXR3ZWFyJTIwYmFzZWJhbGwlMjBjYXAlMjBiZWFuaWUlMjBoYXQlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MHx8fHwxNzg5ODU0MTA4fDA&ixlib=rb-4.1.0&q=75&w=800"),
    P("paz-18", "ACID LIME LOGO 5-PANEL SNAPBACK", "caps", "Snapback", 32, None, "NEW DROP", None, "Acid Lime", CAP_DESC,
      U + "photo-1574427797991-b086946fa9e7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHxzdHJlZXR3ZWFyJTIwYmFzZWJhbGwlMjBjYXAlMjBiZWFuaWUlMjBoYXQlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MHx8fHwxNzg5ODU0MTA4fDA&ixlib=rb-4.1.0&q=75&w=800",
      U + "photo-1523380744952-b7e00e6e2ffa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxzdHJlZXR3ZWFyJTIwYmFzZWJhbGwlMjBjYXAlMjBiZWFuaWUlMjBoYXQlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MHx8fHwxNzg5ODU0MTA4fDA&ixlib=rb-4.1.0&q=75&w=800"),
    P("paz-19", "BLACKOUT TACTICAL DAD HAT", "caps", "Strapback", 26, 32, "LIMITED", None, "Triple Black", CAP_DESC,
      X + "35515095/pexels-photo-35515095.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=650&w=940",
      X + "15752006/pexels-photo-15752006.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=650&w=940"),
    P("paz-20", "UNRULY RETRO BASEBALL CAP", "caps", "Fitted", 30, None, "POPULAR", None, "Washed Navy", CAP_DESC,
      X + "15752006/pexels-photo-15752006.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=650&w=940",
      X + "35515095/pexels-photo-35515095.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=650&w=940"),
    P("paz-21", "ACID MONOGRAM HEAVY BEANIE", "caps", "One Size", 25, 30, "HOT", None, "Charcoal", CAP_DESC,
      U + "photo-1532332248682-206cc786359f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHszfHxzdHJlZXR3ZWFyJTIwYmFzZWJhbGwlMjBjYXAlMjBiZWFuaWUlMjBoYXQlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MHx8fHwxNzg5ODU0MTA4fDA&ixlib=rb-4.1.0&q=75&w=800",
      U + "photo-1635650804483-2a77a8c9e728?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHxfHxzdHJlZXR3ZWFyJTIwYmFzZWJhbGwlMjBjYXAlMjBiZWFuaWUlMjBoYXQlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MHx8fHwxNzg5ODU0MTA4fDA&ixlib=rb-4.1.0&q=75&w=800"),
]

PRODUCTS_DIR = Path("/app/frontend/public/products")

REVIEW_NAMES = [
    "Aarav M", "Zara K", "Rohan D", "Maya S", "Kabir V", "Ishaan R",
    "Anaya P", "Vihaan T", "Diya N", "Arjun B", "Sana F", "Reyansh G",
]

REVIEW_POOL = [
    (5, "HEAVY AS PROMISED", "The fabric weight is unreal. Boxy drape sits exactly like the campaign shots. Two washes in, zero fade."),
    (5, "INSTANT GRAIL", "Got stopped twice on the street asking where it's from. True to size for the oversized fit."),
    (5, "WORTH EVERY CENT", "Stitching, print quality, the collar rib — everything feels premium. Already ordered a second colorway."),
    (4, "NEARLY PERFECT", "Thick cotton and a clean print. Sleeves run slightly longer than expected but the drape is fire."),
    (5, "BEST TEE I OWN", "280 GSM is no joke. It holds its shape all day and the graphic still looks brand new."),
    (4, "SOLID COP", "Quality is way above the price point. Shipping took four days, otherwise flawless."),
    (5, "CERTIFIED HEAT", "The graphic pops way harder in person. Fits boxy without looking like a tent."),
    (3, "GOOD, NOT GREAT", "Fabric is excellent but the fit runs bigger than the size chart. Size down if between sizes."),
    (5, "NO NOTES", "Perfect weight, perfect cut, perfect print. Third PAZOOKA drop and they never miss."),
    (4, "DAILY DRIVER", "Wear it three times a week. Collar hasn't sagged at all, which never happens at this price."),
    (5, "FITS LIKE ARMOR", "Structured but not stiff. The studio photos don't do the fabric justice."),
    (4, "LOUD IN THE BEST WAY", "Print is crisp and the acid accents glow. Wish there were more colorways."),
]


def build_seed_reviews(pid):
    rng = random.Random(f"pazooka-{pid}")
    reviews = []
    for _ in range(rng.randint(4, 11)):
        rating, title, body = rng.choice(REVIEW_POOL)
        reviews.append({
            "product_id": pid,
            "name": rng.choice(REVIEW_NAMES),
            "rating": rating,
            "title": title,
            "comment": body,
            "verified": rng.random() > 0.15,
            "created_at": (datetime.now(timezone.utc) - timedelta(days=rng.randint(2, 120))).isoformat(),
        })
    return reviews


async def attach_ratings(products):
    summary = {}
    pipeline = [{"$group": {"_id": "$product_id", "avg": {"$avg": "$rating"}, "count": {"$sum": 1}}}]
    async for row in db.reviews.aggregate(pipeline):
        summary[row["_id"]] = {"avg": round(row["avg"], 1), "count": row["count"]}
    for p in products:
        p["rating"] = summary.get(p["id"], {"avg": 0, "count": 0})
    return products

for i, p in enumerate(PRODUCTS):
    p["drop_index"] = i + (50 if p["tag"] == "NEW DROP" else 0)
    if (PRODUCTS_DIR / f"{p['id']}.png").exists():
        p["images"] = [f"/products/{p['id']}.png", f"/products/{p['id']}.png"]


@api_router.get("/")
async def root():
    return {"message": "PAZOOKA API live"}


@api_router.get("/products")
async def list_products(category: Optional[str] = None, q: Optional[str] = None,
                        sort: Optional[str] = None, tag: Optional[str] = None):
    query = {}
    if category and category != "all":
        query["category"] = category
    if tag:
        query["tag"] = tag.upper()
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    sort_map = {"price_asc": ("price", 1), "price_desc": ("price", -1)}
    cursor = db.products.find(query, {"_id": 0})
    if sort in sort_map:
        field, direction = sort_map[sort]
        cursor = cursor.sort(field, direction)
    else:
        cursor = cursor.sort("drop_index", -1)
    return await attach_ratings(await cursor.to_list(100))


@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    doc = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return (await attach_ratings([doc]))[0]


class OrderItemIn(BaseModel):
    product_id: str
    size: str
    qty: int


class CustomerIn(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    city: str
    zip: str


class OrderCreate(BaseModel):
    items: List[OrderItemIn]
    customer: CustomerIn
    promo_code: Optional[str] = None


PROMO_CODES = {"PAZOOKA10": 0.10}
FREE_SHIPPING_THRESHOLD = 75.0
SHIPPING_FLAT = 6.0


@api_router.post("/orders")
async def create_order(payload: OrderCreate):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    items = []
    subtotal = 0.0
    for it in payload.items:
        if it.qty < 1 or it.qty > 10:
            raise HTTPException(status_code=400, detail="Invalid quantity")
        p = next((x for x in PRODUCTS if x["id"] == it.product_id), None)
        if not p:
            raise HTTPException(status_code=404, detail=f"Product {it.product_id} not found")
        if it.size not in p["sizes"]:
            raise HTTPException(status_code=400, detail=f"Invalid size for {p['name']}")
        line = round(p["price"] * it.qty, 2)
        subtotal += line
        items.append({
            "product_id": p["id"], "name": p["name"], "price": p["price"],
            "image": p["images"][0], "size": it.size, "qty": it.qty, "line_total": line,
        })
    subtotal = round(subtotal, 2)
    discount = 0.0
    promo = (payload.promo_code or "").strip().upper()
    if promo:
        if promo not in PROMO_CODES:
            raise HTTPException(status_code=400, detail="Invalid promo code")
        discount = round(subtotal * PROMO_CODES[promo], 2)
    shipping = 0.0 if (subtotal - discount) >= FREE_SHIPPING_THRESHOLD else SHIPPING_FLAT
    total = round(subtotal - discount + shipping, 2)
    order = {
        "order_number": f"PZ-{uuid.uuid4().hex[:8].upper()}",
        "items": items,
        "customer": payload.customer.model_dump(),
        "subtotal": subtotal, "discount": discount,
        "promo_code": promo or None, "shipping": shipping, "total": total,
        "status": "confirmed", "payment": "demo",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.orders.insert_one(order)
    order.pop("_id", None)
    return order


class ReviewCreate(BaseModel):
    name: str
    rating: int
    title: Optional[str] = None
    comment: str


@api_router.get("/products/{product_id}/reviews")
async def get_reviews(product_id: str):
    docs = await db.reviews.find({"product_id": product_id}, {"_id": 0}).sort("created_at", -1).to_list(200)
    avg = round(sum(d["rating"] for d in docs) / len(docs), 1) if docs else 0
    return {"count": len(docs), "avg": avg, "reviews": docs}


@api_router.post("/products/{product_id}/reviews", status_code=201)
async def add_review(product_id: str, payload: ReviewCreate):
    if not any(p["id"] == product_id for p in PRODUCTS):
        raise HTTPException(status_code=404, detail="Product not found")
    if not 1 <= payload.rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be 1-5")
    if not payload.name.strip() or not payload.comment.strip():
        raise HTTPException(status_code=400, detail="Name and comment are required")
    doc = {
        "product_id": product_id,
        "name": payload.name.strip()[:60],
        "rating": payload.rating,
        "title": (payload.title or "").strip()[:80],
        "comment": payload.comment.strip()[:600],
        "verified": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.reviews.insert_one(doc)
    doc.pop("_id", None)
    return doc


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def seed_products():
    for p in PRODUCTS:
        await db.products.update_one({"id": p["id"]}, {"$set": p}, upsert=True)
    logger.info("Seeded %d PAZOOKA products", len(PRODUCTS))
    for p in PRODUCTS:
        if await db.reviews.count_documents({"product_id": p["id"]}) == 0:
            await db.reviews.insert_many(build_seed_reviews(p["id"]))
    logger.info("Review seed check complete")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
