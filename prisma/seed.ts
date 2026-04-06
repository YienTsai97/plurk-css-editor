import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Dark Theme' },
      update: {},
      create: {
        name: 'Dark Theme',
        description: 'Dark theme styles for Plurk'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Colorful' },
      update: {},
      create: {
        name: 'Colorful',
        description: 'Bright and colorful styles'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Minimal' },
      update: {},
      create: {
        name: 'Minimal',
        description: 'Clean and minimal designs'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Gaming' },
      update: {},
      create: {
        name: 'Gaming',
        description: 'Gaming-themed styles'
      }
    })
  ]);

  console.log('✅ Categories created:', categories.length);

  // Create official templates
  const officialTemplates = await Promise.all([
    prisma.styleTemplate.upsert({
      where: { slug: 'dark-mode-classic' },
      update: {},
      create: {
        name: 'Dark Mode Classic',
        slug: 'dark-mode-classic',
        description: 'A classic dark theme for Plurk with comfortable reading experience',
        cssContent: `/* Dark Mode Classic Template */
.plurk-timeline {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

.plurk-post {
  background-color: #2d2d2d;
  border: 1px solid #404040;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 16px;
}

.plurk-post-content {
  color: #e0e0e0;
  line-height: 1.6;
}

.plurk-post-actions {
  border-top: 1px solid #404040;
  padding-top: 12px;
  margin-top: 12px;
}

.plurk-post-actions button {
  background-color: #404040;
  color: #e0e0e0;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  margin-right: 8px;
}

.plurk-post-actions button:hover {
  background-color: #505050;
}`,
        isOfficial: true,
        visibility: 'PUBLIC' as any,
        createdBy: '00000000-0000-0000-0000-000000000000' // Placeholder for system user
      }
    }),
    prisma.styleTemplate.upsert({
      where: { slug: 'colorful-vibes' },
      update: {},
      create: {
        name: 'Colorful Vibes',
        slug: 'colorful-vibes',
        description: 'Bright and energetic color scheme for a fun Plurk experience',
        cssContent: `/* Colorful Vibes Template */
.plurk-timeline {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.plurk-post {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  margin-bottom: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.plurk-post-content {
  color: #333;
  font-weight: 500;
  line-height: 1.7;
}

.plurk-post-actions {
  border-top: 2px solid #ff6b6b;
  padding-top: 16px;
  margin-top: 16px;
}

.plurk-post-actions button {
  background: linear-gradient(45deg, #ff6b6b, #ffa500);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  margin-right: 12px;
  font-weight: 600;
  transition: transform 0.2s;
}

.plurk-post-actions button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}`,
        isOfficial: true,
        visibility: 'PUBLIC' as any,
        createdBy: '00000000-0000-0000-0000-000000000000' // Placeholder for system user
      }
    }),
    prisma.styleTemplate.upsert({
      where: { slug: 'minimal-clean' },
      update: {},
      create: {
        name: 'Minimal Clean',
        slug: 'minimal-clean',
        description: 'Clean and minimal design focusing on readability',
        cssContent: `/* Minimal Clean Template */
.plurk-timeline {
  background-color: #fafafa;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.plurk-post {
  background-color: white;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  margin-bottom: 12px;
  padding: 16px;
  transition: box-shadow 0.2s ease;
}

.plurk-post:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.plurk-post-content {
  color: #2c3e50;
  line-height: 1.6;
  font-size: 15px;
}

.plurk-post-actions {
  border-top: 1px solid #ecf0f1;
  padding-top: 12px;
  margin-top: 12px;
}

.plurk-post-actions button {
  background-color: transparent;
  color: #7f8c8d;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  padding: 6px 12px;
  margin-right: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.plurk-post-actions button:hover {
  background-color: #ecf0f1;
  color: #2c3e50;
  border-color: #95a5a6;
}`,
        isOfficial: true,
        visibility: 'PUBLIC' as any,
        createdBy: '00000000-0000-0000-0000-000000000000' // Placeholder for system user
      }
    })
  ]);

  console.log('✅ Official templates created:', officialTemplates.length);

  // Link templates to categories
  const templateCategories = await Promise.all([
    // Dark Mode Classic -> Dark Theme
    prisma.styleTemplateCategory.upsert({
      where: {
        styleTemplateId_categoryId: {
          styleTemplateId: officialTemplates[0].id,
          categoryId: categories[0].id
        }
      },
      update: {},
      create: {
        styleTemplateId: officialTemplates[0].id,
        categoryId: categories[0].id
      }
    }),
    // Colorful Vibes -> Colorful
    prisma.styleTemplateCategory.upsert({
      where: {
        styleTemplateId_categoryId: {
          styleTemplateId: officialTemplates[1].id,
          categoryId: categories[1].id
        }
      },
      update: {},
      create: {
        styleTemplateId: officialTemplates[1].id,
        categoryId: categories[1].id
      }
    }),
    // Minimal Clean -> Minimal
    prisma.styleTemplateCategory.upsert({
      where: {
        styleTemplateId_categoryId: {
          styleTemplateId: officialTemplates[2].id,
          categoryId: categories[2].id
        }
      },
      update: {},
      create: {
        styleTemplateId: officialTemplates[2].id,
        categoryId: categories[2].id
      }
    })
  ]);

  console.log('✅ Template categories linked:', templateCategories.length);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
