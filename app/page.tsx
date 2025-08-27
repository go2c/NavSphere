import { NavigationContent } from '@/components/navigation-content'
import { Metadata } from 'next/types'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Container } from '@/components/ui/container'
import type { SiteConfig } from '@/types/site'
import siteDataRaw from '@/navsphere/content/site.json'

async function getData() {
  // 获取 navigationData
  let navigationData = { navigationItems: [] }
  try {
      const res = await fetch('https://nav.samshen.my/api/navigation', { cache: 'no-store' })
      if (res.ok) {
        const text = await res.text()
        navigationData = JSON.parse(text)
      }
    } catch (e) {
      // 可以用 console.error(e) 打印错误，开发环境下有用
  }

  // 确保 theme 类型正确
  const siteData: SiteConfig = {
    ...siteDataRaw,
    appearance: {
      ...siteDataRaw.appearance,
      theme: (siteDataRaw.appearance.theme === 'light' ||
        siteDataRaw.appearance.theme === 'dark' ||
        siteDataRaw.appearance.theme === 'system')
        ? siteDataRaw.appearance.theme
        : 'system'
    }
  }

  return {
    navigationData: navigationData || { navigationItems: [] },
    siteData: siteData || {
      basic: {
        title: 'NavSphere',
        description: '',
        keywords: ''
      },
      appearance: {
        logo: '',
        favicon: '',
        theme: 'system' as const
      }
    }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { siteData } = await getData()

  return {
    title: siteData.basic.title,
    description: siteData.basic.description,
    keywords: siteData.basic.keywords,
    icons: {
      icon: siteData.appearance.favicon,
    },
  }
}

export default async function HomePage() {
  const { navigationData, siteData } = await getData()

  return (
    <Container>
      <NavigationContent navigationData={navigationData} siteData={siteData} />
      <ScrollToTop />
    </Container>
  )
}
