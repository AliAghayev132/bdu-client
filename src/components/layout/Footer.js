export default function Footer() {
 
  return (
    <footer className="mx-auto wrapper mb-6 mt-6">
      <div  className="py-12 wrapper rounded-4xl bg-secondary border-t border-secondary/10 text-white">
        <div className="grid md:grid-cols-4 gap-8 items-start">
          <div className="md:col-span-2">
            <h3 className="text-white font-semibold mb-2">Ünvan</h3>
            <p className="text-white text-sm">
              Bakı şəhəri, akademik Zahid Xəlilov küçəsi 33, AZ 1148
            </p>
            <p className="text-white text-sm mt-4">
              Bütün hüquqlar qorunur. Hər hansı bir lisenziyalı materialdan istifadə etmək üçün əlaqə saxlayın.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-white font-semibold mb-2">Əlaqə</h3>
            <p className="text-white text-sm">
              Tel.: <a className="hover:text-primary" href="tel:+994124303245">(+994 12) 430-32-45</a>
            </p>
            <p className="text-white text-sm">
              <a className="hover:text-primary" href="mailto:info@bsu.edu.az">info@bsu.edu.az</a>
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Faydalı keçidlər</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-white/90 hover:text-white transition-colors">Ana səhifə</a></li>
              <li><a href="#" className="text-white/90 hover:text-white transition-colors">Xəbərlər</a></li>
              <li><a href="#" className="text-white/90 hover:text-white transition-colors">Elanlar</a></li>
              <li><a href="#" className="text-white/90 hover:text-white transition-colors">Əlaqə</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Sosial şəbəkələr</h3>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white/90 group-hover:text-white"><path d="M22 12a10 10 0 1 0-11.6 9.87v-6.99H7.9V12h2.5V9.8c0-2.46 1.47-3.82 3.72-3.82 1.08 0 2.21.19 2.21.19v2.43h-1.25c-1.23 0-1.62.77-1.62 1.56V12h2.76l-.44 2.88h-2.32v6.99A10 10 0 0 0 22 12Z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white/90 group-hover:text-white"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5Zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5Zm5.75-3.25a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25Z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white/90 group-hover:text-white"><path d="M19 3A2.94 2.94 0 0 1 22 6v12a2.94 2.94 0 0 1-3 3H5a2.94 2.94 0 0 1-3-3V6a2.94 2.94 0 0 1 3-3Zm-9.86 7H6.21v8h2.93Zm.19-2.88A1.64 1.64 0 1 0 7.69 5.5 1.64 1.64 0 0 0 9.33 7.12ZM20 13.5c0-3.13-1.67-4.59-3.89-4.59A3.35 3.35 0 0 0 13 10.67h-.06V10H10v8h3v-4.29a1.76 1.76 0 0 1 1.69-1.93c1.13 0 1.64.84 1.64 2V18h3Z"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white/90 group-hover:text-white"><path d="M23.5 7.5a3 3 0 0 0-2.1-2.1C19.6 5 12 5 12 5s-7.6 0-9.4.4A3 3 0 0 0 .5 7.5 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 4.5 3 3 0 0 0 2.1 2.1C4.4 19 12 19 12 19s7.6 0 9.4-.4a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-4.5ZM9.75 15.02V8.98L15.5 12Z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary/10 mt-8 pt-6 text-white text-sm">
          <p>© BDU, Bakı - 2025</p>
        </div>
      </div>
    </footer>
  );
}
