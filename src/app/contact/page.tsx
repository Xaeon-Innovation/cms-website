import ContactPageClient from "./ContactPageClient";
import { ContactMapEmbed } from "./ContactMapEmbed";

export default function ContactPage() {
  return <ContactPageClient mapSlot={<ContactMapEmbed />} />;
}
