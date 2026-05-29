param(
    [Parameter(Mandatory=$true)]
    [string]$InputDir
)

# ================================
# Resolve path
# ================================
$InputDir = (Resolve-Path $InputDir).Path

$FolderName = Split-Path $InputDir -Leaf
$ParentDir  = Split-Path $InputDir -Parent

# indoor.json / outdoor.json
$jsonName = ($FolderName.ToLower()) + ".json"
$jsonPath = Join-Path $ParentDir $jsonName

Write-Host "Generating: $jsonPath"

# ================================
# Read all image files
# ================================
$files = Get-ChildItem $InputDir -File | Where-Object {
    $_.Extension -match '\.(png|jpg|jpeg|webp)$'
} | Sort-Object Name

$result = @()

foreach ($file in $files) {

    $relativePath = "$FolderName/$($file.Name)"

    $result += $relativePath
}

# ================================
# Save json
# ================================
$result |
    ConvertTo-Json -Depth 10 |
    Set-Content $jsonPath -Encoding UTF8

Write-Host "Done."
Write-Host "Generated $($result.Count) items."