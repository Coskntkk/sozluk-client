export default function Home() {
  return (
    <header class="bg-blue-700 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">Sözlük</h1>
        <nav>
          <ul class="flex space-x-4">
            <li><a href="#" class="hover:bg-blue-600 p-2 rounded">Anasayfa</a></li>
            <li><a href="#" class="hover:bg-blue-600 p-2 rounded">Gündem</a></li>
            <li><a href="#" class="hover:bg-blue-600 p-2 rounded">Başlıklar</a></li>
            <li><a href="#" class="hover:bg-blue-600 p-2 rounded">Kullanıcı</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
