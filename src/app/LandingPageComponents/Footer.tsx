// components/Footer.tsx
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left - Brand */}
        <div>
          <h1 className="text-6xl font-bold text-white">InvPro</h1>
          <p className="mt-2 text-xl text-gray-400"><i>
            Transforming numbers into actionable insights.</i>
          </p>
        </div>

        {/* Middle - Contact + Links */}
        <div className="flex justify-center space-x-16">
          {/* Contact Us */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">Contact Us</h2>
            <ul className="space-y-2 text-sm">
              <li>Email: ds.sudeep04@yahoo.com</li>
              <li>Phone: +91 9007755859</li>
              <li>Address: Bhubaneswar, India</li>
            </ul>
            <div className="flex items-center mt-4 space-x-3">
      {/* Circle image */}
      <img
        src="/Sudeepimg.jpeg" 
        alt="Developer"
        className="w-12 h-12 rounded-full border-2 border-gray-300 object-cover"
      />
      {/* Text + link */}
      <a
        href="https://sudeep.tech/" 
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-400 hover:underline"
      >
        More about developer →
      </a>
    </div>
          </div>


          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Quick Links</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Get Help</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">SiteMap</a></li>
              <li><a href="#" className="hover:text-white">Connect</a></li>
            </ul>
          </div>
        </div>

        {/* Right - Social Links + Map */}
        <div className="flex flex-col items-start space-y-4 md:items-end">
          <div className="flex space-x-6">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-2xl"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-2xl"
            >
              <FaGithub />
            </a>
          </div>

          {/* Embedded Google Map */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.7158300000003!2d85.83146521444458!3d20.2960582863856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909a5c4cfadad%3A0xb2b7f8a37b7c5a7!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1689250489382!5m2!1sen!2sin"
            width="250"
            height="150"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg shadow-md"
          ></iframe>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-lg text-gray-500">
        © {new Date().getFullYear()} InvPro. All Rights Reserved.
      </div>
    </footer>
  );
}
