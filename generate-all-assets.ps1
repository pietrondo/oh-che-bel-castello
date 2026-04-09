$headers = @{
    "Authorization" = "Bearer sk-cv-7996507538f446c69cad3f96c6637ee3"
    "Content-Type" = "application/json"
}

$assets = @{
    "keep" = "Medieval royal castle keep stone fortress towers"
    "farm" = "Medieval farm building with wheat fields"
    "windmill" = "Medieval windmill with rotating blades"
    "cathedral" = "Medieval cathedral church with cross"
    "university" = "Medieval university building with books"
    "blacksmith" = "Medieval blacksmith forge with anvil hammer"
    "house" = "Medieval peasant house thatched roof"
    "barracks" = "Medieval military barracks with weapons shields"
    "lumber_mill" = "Medieval lumber mill saw logs wood"
    "stone_quarry" = "Medieval stone quarry blocks"
    "iron_mine" = "Medieval iron mine cave"
    "bakery" = "Medieval bakery oven bread"
    "brewery" = "Medieval brewery barrels beer"
    "tailor" = "Medieval tailor shop fabric clothes"
    "church" = "Medieval small church chapel"
    "well" = "Medieval water well"
}

function Generate-Asset($name, $prompt) {
    Write-Host "Generating $name..."
    
    $json = '{\"model\":\"qwen-image-2512\",\"prompt\":\"' + $prompt + ', top down view, game asset, 2D sprite\",\"n\":1,\"size\":\"512x512\",\"response_format\":\"b64_json\"}'
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.openadapter.in/v1/images/generations" -Method Post -Headers $headers -Body $json
        
        if ($response.data[0].b64_json) {
            $b64 = $response.data[0].b64_json
            $bytes = [Convert]::FromBase64String($b64)
            $path = "$PWD\public\assets\buildings\$name.png"
            [System.IO.File]::WriteAllBytes($path, $bytes)
            Write-Host "  Saved: $name.png"
        }
    } catch {
        Write-Host "  Error: $_"
    }
}

New-Item -ItemType Directory -Force -Path "public\assets\buildings" | Out-Null

foreach ($asset in $assets.GetEnumerator()) {
    Generate-Asset $asset.Key $asset.Value
}

Write-Host "Done!"
