#!/bin/bash

ASSETS_DIR="./public/assets"

echo "🔍 Verificando imagens em $ASSETS_DIR ..."

for img in $(find $ASSETS_DIR -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \)); do
    filename=$(basename -- "$img")
    extension="${filename##*.}"
    name="${filename%.*}"

    echo "📌 Processando: $filename"

    convert "$img" -resize 400 "$ASSETS_DIR/${name}-400.webp"
    convert "$img" -resize 800 "$ASSETS_DIR/${name}-800.webp"
    convert "$img" -resize 1200 "$ASSETS_DIR/${name}-1200.webp"

    echo "   ✔ Criado: ${name}-400.webp"
    echo "   ✔ Criado: ${name}-800.webp"
    echo "   ✔ Criado: ${name}-1200.webp"
done

echo "🎉 Finalizado! Todas as versões responsivas foram geradas."
