import SearchInterface from '@/components/SearchInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Visual Search System
          </h1>
          <p className="text-lg text-gray-600">
            Advanced search with text, voice, and image capabilities
          </p>
        </div>
        
        <SearchInterface />
      </div>
    </main>
  )
}