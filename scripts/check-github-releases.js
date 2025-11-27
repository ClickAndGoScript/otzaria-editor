import { Octokit } from '@octokit/rest'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const GITHUB_OWNER = process.env.GITHUB_OWNER
const GITHUB_REPO = process.env.GITHUB_REPO

async function checkReleases() {
  try {
    console.log('🔍 Checking GitHub Releases...')
    console.log(`   Repo: ${GITHUB_OWNER}/${GITHUB_REPO}\n`)
    
    // קבל את כל ה-releases
    const { data: releases } = await octokit.repos.listReleases({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
    })
    
    console.log(`📦 Found ${releases.length} releases:\n`)
    
    for (const release of releases) {
      console.log(`\n📌 Release: ${release.name}`)
      console.log(`   Tag: ${release.tag_name}`)
      console.log(`   Created: ${release.created_at}`)
      
      // קבל את ה-assets
      const { data: assets } = await octokit.repos.listReleaseAssets({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        release_id: release.id,
      })
      
      console.log(`   Assets: ${assets.length}`)
      
      if (assets.length > 0) {
        console.log(`\n   📄 First 10 assets:`)
        assets.slice(0, 10).forEach(asset => {
          console.log(`      - ${asset.name}`)
        })
        
        if (assets.length > 10) {
          console.log(`      ... and ${assets.length - 10} more`)
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkReleases()
