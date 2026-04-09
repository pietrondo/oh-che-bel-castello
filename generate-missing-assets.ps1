$headers = @{
    "Authorization" = "Bearer sk-cv-7996507538f446c69cad3f96c6637ee3"
    "Content-Type" = "application/json"
}

$assets = @{
    "iron_mine" = "Medieval iron mine cave, top down view, game asset, 2D sprite"
    "bakery" = "Medieval bakery oven bread, top down view, game asset, 2D sprite"
    "brewery" = "Medieval brewery barrels beer, top down view, game asset, 2D sprite"
    "tailor" = "Medieval tailor shop fabric clothes, top down view, game asset, 2D sprite"
    "church" = "Medieval small church chapel, top down view, game asset, 2D sprite"
    "well" = "Medieval water well, top down view, game asset, 2D sprite"
    "road" = "Medieval cobblestone road path, top down view, game asset, 2D sprite"
    "tower" = "Medieval defensive tower stone, top down view, game asset, 2D sprite"
}

function Generate-Asset($name, $prompt) {
    Write-Host "Generating $name..."
    
    $body = @{
        model = "qwen-image-2512"
        prompt = $prompt
        n = 1
        size = "512x512"
        response_format = "b64_json"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.openadapter.in/v1/images/generations" -Method Post -Headers $headers -Body $body
        
        if ($response.data[0].b64_json) {
            $b64 = $response.data[0].b64_json
            $bytes = [Convert]::FromBase64String($b64)
            $path = "$PWD\public\assets\buildings\$name.png"
            [System.IO.File]::WriteAllBytes($path, $bytes)
            Write-Host "  Saved: $name.png" -ForegroundColor Green
        }
    } catch {
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

New-Item -ItemType Directory -Force -Path "public\assets\buildings" | Out-Null

foreach ($asset in $assets.GetEnumerator()) {
    Generate-Asset $asset.Key $asset.Value
}

Write-Host "`nDone!" -ForegroundColor Cyan