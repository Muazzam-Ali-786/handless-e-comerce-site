import { MapPin, Phone, Clock } from "lucide-react";

const stores = [
  {
    city: "Lahore",
    address: "14-B MM Alam Road, Gulberg III",
    phone: "+92 42 111 222 333",
    hours: "Mon–Sat: 11am – 9pm",
  },
  {
    city: "Karachi",
    address: "Shop 5, Dolmen Mall Clifton",
    phone: "+92 21 111 222 444",
    hours: "Mon–Sun: 10am – 10pm",
  },
  {
    city: "Islamabad",
    address: "Ground Floor, Centaurus Mall",
    phone: "+92 51 111 222 555",
    hours: "Mon–Sun: 10am – 10pm",
  },
];

export default function StoresPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light uppercase tracking-widest mb-4">Our Stores</h1>
        <p className="text-gray-500 font-light">
          Visit us in person and experience MAISON first-hand with our expert style advisors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stores.map((store) => (
          <div key={store.city} className="border border-gray-200 p-8 hover:border-black transition-colors">
            <h2 className="text-xl font-semibold uppercase tracking-widest mb-6">{store.city}</h2>
            <ul className="space-y-5 text-sm text-gray-600 font-light">
              <li className="flex gap-3 items-start">
                <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                <span>{store.address}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{store.phone}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{store.hours}</span>
              </li>
            </ul>
            <a
              href={`https://maps.google.com/?q=${store.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-8 text-xs font-semibold uppercase tracking-widest border-b border-black pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors"
            >
              Get Directions →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
