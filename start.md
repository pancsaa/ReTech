# ♻️ ReTech
## Újrahasznosított elektronikai eszközök platformja

---

# 📋 Előfeltételek

Az alkalmazás futtatásához az alábbi programok szükségesek. Ha valamelyik nincs telepítve, kövesse a megadott útmutatókat a telepítéshez.

## 🐳 Docker Desktop

A Docker az alkalmazás konténerizált futtatásához szükséges. Egyetlen paranccsal elindítja az összes szükséges szolgáltatást (backend, frontend, adatbázis).

- 🔗 Letöltés: https://www.docker.com/products/docker-desktop  
- Telepítés után indítsa el a Docker Desktop alkalmazást, és várja meg, amíg a státusz: **Engine running**

---

## 🌱 Git *(opcionális)*

Csak akkor szükséges, ha git segítségével tölti le a projektet.

- 🔗 Letöltés: https://git-scm.com/downloads

---

# 🚀 Telepítés és indítás

## 1️⃣ Forráskód letöltése

Válassza ki az Önnek megfelelő módot:

### A) Git segítségével

```bash
git clone https://github.com/pancsaa/ReTech.git
cd ReTech
```

### B) ZIP fájlból

1. Csomagolja ki a ZIP fájlt egy tetszőleges mappába  
2. Nyisson egy terminált a kicsomagolt mappában  

**Terminál megnyitása:**
- Windows: kattintson a címsorra → írja be: `cmd`
- macOS / Linux: jobb klikk → Terminál megnyitása itt

---

## 3️⃣ Alkalmazás indítása

A gyökérkönyvtárban futtassa:

```bash
docker compose up -d --build
```

> Első indításkor néhány percet vehet igénybe.

---

# 🌐 Elérés

| Szolgáltatás | URL |
|-------------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api |
| Prisma Studio | http://localhost:5555 |

---

# 🛠️ Hasznos parancsok

## Leállítás

```bash
docker compose down
```

---

# ⚠️ Gyakori problémák

## "Port already in use"

Valamelyik port (3000, 3306, 5173) foglalt.

**Megoldás:**
- Állítsa le az adott programot  
- Indítsa újra a gépet  

---

## Docker nem indul

Győződjön meg róla, hogy a Docker Desktop alkalmazás fut (a tálcán látható az ikonja és zöld / "Running" státuszban van).

---

## Adatbázis nem elérhető

Várjon 20–30 másodpercet, majd:

```bash
docker compose restart backend
```
---
## `.env` fájl
Ha a program nem készítette el a `.env` fájlt akkor a backend mappában található `.env.example` fájl alapján készítse el kézileg.