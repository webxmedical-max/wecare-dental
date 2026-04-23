#!/bin/bash
# Deploy all 25 generated sites to GitHub repos under webxmedical-max
# Each repo = one subdomain on webxmed.ma

export PATH="/c/Program Files/GitHub CLI:$PATH"
OWNER="webxmedical-max"
SITES_DIR="/c/Users/ALi/Desktop/500 000 MAD/dr ikram el ouafi/generated-sites"

SLUGS=(
  ali-bennis
  calif-smile
  centre-dentaire-elouati
  centre-dentaire-haline-salma
  centre-dentaire-les-iris
  centre-dentaire-meryem-reggab
  centre-dentaire-panoramique
  centre-dentaire-ziani
  clinique-dentaire-les-tulipes
  clinique-dentaire-panoramic-dental-smile
  dentiste-de-garde-casablanca
  estheticum-dentaire-casablanca
  ismail-el-khal
  kenza-sentissi
  laamiri-siham
  lamtiri-saad
  leghtas-akram
  lemseffer-ghali
  mikou-dentaire
  nasry-aboujihade
  nisrine-rais
  omar-senhaji
  panoramique-dentaire-belvedere
  roqai-chaoui-abderrahmane
  salghi-mohammed
)

SUCCESS=0
FAIL=0

for SLUG in "${SLUGS[@]}"; do
  echo ""
  echo "=========================================="
  echo "[$((SUCCESS + FAIL + 1))/25] Processing: $SLUG"
  echo "=========================================="

  SITE_DIR="$SITES_DIR/$SLUG"

  if [ ! -d "$SITE_DIR" ]; then
    echo "  ERROR: Directory not found: $SITE_DIR"
    FAIL=$((FAIL + 1))
    continue
  fi

  # Create repo (skip if exists)
  echo "  Creating repo $OWNER/$SLUG..."
  gh repo create "$OWNER/$SLUG" --public --description "Website for $SLUG.webxmed.ma" 2>&1 | head -3

  # Init git, add, commit, push
  cd "$SITE_DIR"

  # Clean any existing git
  rm -rf .git

  git init -b main > /dev/null 2>&1
  git add -A > /dev/null 2>&1
  git commit -m "Initial deploy — $SLUG.webxmed.ma" > /dev/null 2>&1
  git remote add origin "https://github.com/$OWNER/$SLUG.git" 2>/dev/null

  echo "  Pushing to GitHub..."
  if git push -u origin main --force 2>&1 | tail -2; then
    echo "  OK: https://github.com/$OWNER/$SLUG"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "  FAILED to push $SLUG"
    FAIL=$((FAIL + 1))
  fi

  cd - > /dev/null
done

echo ""
echo "=========================================="
echo "DONE: $SUCCESS succeeded, $FAIL failed out of 25"
echo "=========================================="
