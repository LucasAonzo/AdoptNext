// Script to update all instances of createClient() to await createClient()
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function updateFiles() {
  console.log('Searching for files with createClient...');
  
  // Find all TypeScript/JavaScript files in the project (excluding node_modules)
  const files = await glob('**/*.{tsx,ts,jsx,js}', {
    ignore: ['node_modules/**', '**/update-createclient.js', 'dist/**', '.next/**'],
  });
  
  let updatedCount = 0;
  
  // Process each file
  for (const file of files) {
    const filePath = path.resolve(file);
    
    // Skip if the file doesn't exist or isn't readable
    if (!fs.existsSync(filePath)) continue;
    
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file imports createClient from our supabase-server
    if (content.includes("import { createClient } from '@/lib/supabase-server'") || 
        content.includes('import { createClient } from "@/lib/supabase-server"')) {
      
      // Replace instances of "const supabase = createClient();" with "const supabase = await createClient();"
      const newContent = content.replace(
        /(const\s+supabase\s*=\s*)createClient\(\)/g, 
        '$1await createClient()'
      );
      
      // If content was changed, write it back
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${file}`);
        updatedCount++;
      }
    }
  }
  
  console.log(`Completed! Updated ${updatedCount} files.`);
}

updateFiles().catch(err => {
  console.error('Error updating files:', err);
}); 