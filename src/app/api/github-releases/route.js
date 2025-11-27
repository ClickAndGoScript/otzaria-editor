import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const revalidate = 3600 // Cache for 1 hour

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'stable' // stable or dev
    
    // Fetch releases from GitHub
    const url = type === 'dev' 
      ? 'https://api.github.com/repos/Y-PLONI/otzaria/releases'
      : 'https://api.github.com/repos/Y-PLONI/otzaria/releases/latest'
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Otzaria-Website'
      },
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch releases')
    }

    const data = await response.json()
    
    // For dev releases, get the first prerelease
    const release = type === 'dev' 
      ? (Array.isArray(data) ? data.find(r => r.prerelease) || data[0] : data)
      : data

    // Extract download links
    const assets = release.assets || []
    const downloads = {
      version: release.tag_name,
      windows: {
        exe: assets.find(a => a.name.endsWith('-windows.exe'))?.browser_download_url,
        msix: assets.find(a => a.name.endsWith('.msix'))?.browser_download_url,
        zip: assets.find(a => a.name.includes('windows') && a.name.endsWith('.zip'))?.browser_download_url
      },
      linux: {
        deb: assets.find(a => a.name.endsWith('.deb'))?.browser_download_url,
        rpm: assets.find(a => a.name.endsWith('.rpm'))?.browser_download_url
      },
      macos: {
        zip: assets.find(a => a.name.includes('macos') && a.name.endsWith('.zip'))?.browser_download_url
      },
      android: {
        apk: assets.find(a => a.name.endsWith('.apk'))?.browser_download_url
      },
      releaseUrl: release.html_url
    }

    return NextResponse.json(downloads)
  } catch (error) {
    console.error('Error fetching GitHub releases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch releases' },
      { status: 500 }
    )
  }
}
