export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light uppercase tracking-widest mb-4">Contact Us</h1>
        <p className="text-gray-500 font-light">We are here to assist you with any inquiries regarding our collections or your order.</p>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Name</label>
            <input type="text" required className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Email</label>
            <input type="email" required className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Message</label>
          <textarea required rows={6} className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"></textarea>
        </div>
        <button type="submit" className="bg-black text-white px-10 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors">
          Send Message
        </button>
      </form>
    </div>
  );
}
