import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor-react';
          if (id.includes('/modules/editorial/PostFormModal') || id.includes('/modules/editorial/IdeasBoard') || id.includes('/modules/editorial/CalendarSimpleED') || id.includes('/modules/editorial/MonthlyReviewED') || id.includes('/modules/editorial/FeedPreviewGrid') || id.includes('/modules/editorial/FunnelViewED') || id.includes('/modules/editorial/CampaignExecED') || id.includes('/modules/editorial/ContentTrackerED') || id.includes('/modules/editorial/PublishingHubED') || id.includes('/modules/editorial/StrategyUpdateED') || id.includes('/modules/editorial/PerformanceLogED') || id.includes('/modules/editorial/MetaPublishModal')) return 'module-editorial';
          if (id.includes('/modules/team/TeamPlannerNMS') || id.includes('/modules/team/CollaboratoriModal')) return 'module-team';
        }
      }
    }
  }
})
