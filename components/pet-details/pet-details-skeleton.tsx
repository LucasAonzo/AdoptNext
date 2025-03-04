export default function PetDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Two-column layout - Main content and sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Gallery skeleton */}
          <div className="space-y-4">
            {/* Back button skeleton */}
            <div className="w-40 h-5 bg-gray-200 rounded-md animate-pulse"></div>
            
            {/* Main image skeleton */}
            <div className="aspect-[3/2] w-full bg-gray-200 rounded-xl animate-pulse"></div>
            
            {/* Thumbnails skeleton */}
            <div className="grid grid-cols-5 gap-2">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Pet info skeleton */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gray-300 p-6 animate-pulse">
              <div className="w-2/3 h-8 bg-white/40 rounded-md mb-3"></div>
              <div className="flex space-x-2">
                <div className="w-24 h-6 bg-white/40 rounded-full"></div>
                <div className="w-20 h-6 bg-white/40 rounded-md"></div>
              </div>
            </div>
            
            {/* Quick info cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-gray-100">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className={`flex flex-col items-center justify-center py-5 px-3 ${i < 3 ? 'border-r' : ''} ${i < 2 ? 'border-b md:border-b-0' : ''} border-gray-100`}>
                  <div className="w-6 h-6 bg-gray-200 rounded-full mb-1 animate-pulse"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded-md animate-pulse mb-1"></div>
                  <div className="w-20 h-5 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              ))}
            </div>
            
            {/* Content sections skeleton */}
            <div className="p-6 space-y-10">
              {/* Overview section */}
              <div>
                <div className="w-48 h-7 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="w-full h-5 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="w-full h-5 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="w-3/4 h-5 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </div>
              
              {/* Characteristics section */}
              <div>
                <div className="w-48 h-7 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center p-4 bg-gray-100 rounded-lg animate-pulse">
                      <div className="flex-shrink-0 mr-3 w-9 h-9 rounded-full bg-gray-200"></div>
                      <div>
                        <div className="w-24 h-4 bg-gray-200 rounded-md mb-1"></div>
                        <div className="w-8 h-4 bg-gray-200 rounded-md"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* History section */}
              <div>
                <div className="w-48 h-7 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
                <div className="bg-gray-100 rounded-lg p-5">
                  <div className="space-y-3">
                    <div className="w-full h-5 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="w-full h-5 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="w-2/3 h-5 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6 animate-pulse">
            <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="w-full h-px bg-gray-200 my-4"></div>
              <div className="w-full h-5 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Similar pets skeleton */}
      <div className="mt-16">
        <div className="w-48 h-7 bg-gray-200 rounded-md mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="w-2/3 h-6 bg-gray-200 rounded-md"></div>
                <div className="flex flex-wrap gap-1">
                  <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
                  <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
                  <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
                </div>
                <div className="w-full h-10 bg-gray-200 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 