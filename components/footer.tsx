import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-monito-yellow pt-8 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-xl text-monito-blue mb-4">Monito</h3>
            <p className="text-gray-700 mb-4">Find your perfect pet companion</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-monito-blue hover:text-monito-blue/80">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-monito-blue hover:text-monito-blue/80">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-monito-blue hover:text-monito-blue/80">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-monito-blue hover:text-monito-blue/80">
                <Youtube size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-monito-blue mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-700 hover:text-monito-blue">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/category" className="text-gray-700 hover:text-monito-blue">
                  Category
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-700 hover:text-monito-blue">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-700 hover:text-monito-blue">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-monito-blue mb-4">Help & Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-700 hover:text-monito-blue">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-700 hover:text-monito-blue">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-700 hover:text-monito-blue">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-700 hover:text-monito-blue">
                  Customer Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-monito-blue mb-4">Newsletter</h4>
            <p className="text-gray-700 mb-4">Subscribe to get updates on new pets and promotions</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-full border-y border-l border-gray-300 focus:outline-none focus:ring-1 focus:ring-monito-blue"
              />
              <Button variant="primary" className="rounded-l-none">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-700 text-sm">© 2023 Monito. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/terms" className="text-gray-700 text-sm hover:text-monito-blue">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-700 text-sm hover:text-monito-blue">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

