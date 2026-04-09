# Script per generare asset edifici mancanti con DALL-E

$apiKey = "sk-9197994139:8171a074923f52b5"
$endpoint = "https://dashscope.aliyuncs.com/compatible-v1/images/generations"
$outputDir = "public/assets"

# Edifici da generare
$buildings = @(
    @{ name = "iron_mine"; prompt = "Medieval iron mine building exterior, wooden structure with stone foundation, mining cart on rails, dark atmosphere, game asset, isometric view, detailed texture" },
    @{ name = "bakery"; prompt = "Medieval bakery building exterior, stone oven, warm glowing windows, bread display, cozy atmosphere, game asset, isometric view, detailed texture" },
    @{ name = "brewery"; prompt = "Medieval brewery building exterior, wooden barrels outside, copper brewing tanks visible, rustic atmosphere, game asset, isometric view, detailed texture" },
    @{ name = "tailor"; prompt = "Medieval tailor shop building exterior, colorful fabrics hanging outside, elegant storefront, game asset, isometric view, detailed texture" },
    @{ name = "church"; prompt = "Medieval small church building exterior, stone walls, bell tower, cross on top, religious atmosphere, game asset, isometric view, detailed texture" },
    @{ name = "well"; prompt = "Medieval stone well, wooden roof structure, bucket and rope, village center piece, game asset, isometric view, detailed texture" },
    @{ name = "road"; prompt = "Medieval cobblestone road segment, stone path with grass edges, game asset, isometric view, detailed texture" },
    @{ name = "tower"; prompt = "Medieval defensive tower, stone construction, arrow slits, battlements on top, game asset, isometric view, detailed texture" }
)

foreach ($building in $buildings) {
    $name = $building.name
    $prompt = $building.prompt
    
    Write-Host "Generazione: $name..."
    
    $body = @{
        model = "qwen-image-2512"
        prompt = $prompt
        n = 1
        size = "1024x1024"
        response_format = "b64_json"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $endpoint -Method Post `
            -Headers @{
                "Content-Type" = "application/json"
                "Authorization" = "Bearer $apiKey"
            } `
            -Body $body
        
        $b64Data = $response.data[0].b64_json
        $outputPath = Join-Path $outputDir "$name-test.png"
        
        [Convert]::SaveBase64ToFile($b64Data, $outputPath)
        Write-Host "  Salvato: $outputPath" -ForegroundColor Green
    } catch {
        Write-Host "  Errore: $_" -ForegroundColor Red
    }
}

Write-Host "`nGenerazione completata!" -ForegroundColor Cyan
