import type React from "react"
import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { motion } from "framer-motion"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const res = await fetch(`https`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
  
      const data = await res.json();
  
      if (data.success) {
        setIsSubmitted(true);
        setFormState({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        alert("Failed to send message");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you. Fill out the form below or use our contact info.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>

            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-100 text-green-800 p-4 rounded-md mb-6"
              >
                Thank you for your message! We'll get back to you soon.
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?"
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message here..."
                  rows={5}
                  className="w-full border rounded-md p-2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-8"
        >
          <div className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            <div className="space-y-6">
              {[
                { icon: <MapPin className="h-5 w-5 text-blue-600" />, label: "Our Location", value: "Pune Institute of Computer Technology" },
                { icon: <Phone className="h-5 w-5 text-blue-600" />, label: "Phone Number", value: "9209415157" },
                { icon: <Mail className="h-5 w-5 text-blue-600" />, label: "Email Address", value: "growup@gmail.com" },
                {
                  icon: <Clock className="h-5 w-5 text-blue-600" />,
                  label: "Business Hours",
                  value: (
                    <>
                      <p>Mon - Fri: 9am - 3:30pm</p>
                      <p>Sat - Sun: Closed</p>
                    </>
                  )
                },
              ].map(({ icon, label, value }, idx) => (
                <div className="flex items-start" key={idx}>
                  <div className="bg-blue-100 p-3 rounded-full mr-4">{icon}</div>
                  <div>
                    <h3 className="font-medium">{label}</h3>
                    <div className="text-gray-600">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Connect With Us</h2>
            <p className="text-gray-600 mb-6">
              Follow us on social media to stay updated with our latest news and announcements.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Facebook className="h-5 w-5" />, bg: "bg-blue-500" },
                { icon: <Twitter className="h-5 w-5" />, bg: "bg-sky-500" },
                { icon: <Instagram className="h-5 w-5" />, bg: "bg-pink-600" },
                { icon: <Linkedin className="h-5 w-5" />, bg: "bg-blue-700" },
              ].map(({ icon, bg }, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className={`${bg} text-white p-3 rounded-full`}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12"
      >
        <div className="border rounded-lg overflow-hidden">
        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15139.064078511767!2d73.85292170000001!3d18.44892980000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1743749835548!5m2!1sen!2sin" width="1400" height="450" style={{ border: "0" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </motion.div>
    </div>
  )
}
