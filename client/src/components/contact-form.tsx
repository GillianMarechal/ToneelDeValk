import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactMessageSchema } from "@shared/schema";
import { Send, CheckCircle } from "lucide-react";

const contactFormSchema = insertContactMessageSchema.extend({
  subject: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Bericht verzonden!",
        description: "Bedankt voor uw bericht. We nemen zo spoedig mogelijk contact met u op.",
      });
      form.reset();
      // Reset success state after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    },
    onError: (error) => {
      toast({
        title: "Fout bij verzenden",
        description: "Er is een fout opgetreden bij het verzenden van uw bericht. Probeer het opnieuw.",
        variant: "destructive",
      });
      console.error("Contact form error:", error);
    },
  });

  const onSubmit = (data: ContactFormData) => {
    submitMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="bg-gray-50 p-8 rounded-xl text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-playfair font-bold text-theatre-navy mb-2">
          Bericht Verzonden!
        </h3>
        <p className="text-theatre-charcoal">
          Bedankt voor uw bericht. We nemen zo spoedig mogelijk contact met u op.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-8 rounded-xl">
      <h2 className="text-2xl font-playfair font-bold text-theatre-navy mb-6">
        Stuur Ons Een Bericht
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-theatre-navy">
                    Naam *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Uw volledige naam"
                      className="focus:ring-2 focus:ring-theatre-red focus:border-theatre-red"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-theatre-navy">
                    Email *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="uw.email@voorbeeld.nl"
                      className="focus:ring-2 focus:ring-theatre-red focus:border-theatre-red"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-theatre-navy">
                  Onderwerp
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="focus:ring-2 focus:ring-theatre-red focus:border-theatre-red">
                      <SelectValue placeholder="Selecteer een onderwerp" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tickets">Kaartreservering</SelectItem>
                    <SelectItem value="membership">Lid worden</SelectItem>
                    <SelectItem value="general">Algemene vraag</SelectItem>
                    <SelectItem value="press">Pers & Media</SelectItem>
                    <SelectItem value="auditions">Audities</SelectItem>
                    <SelectItem value="technical">Technische ondersteuning</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-theatre-navy">
                  Bericht *
                </FormLabel>
                <FormControl>
                  <Textarea 
                    rows={6}
                    placeholder="Vertel ons hoe we u kunnen helpen..."
                    className="resize-none focus:ring-2 focus:ring-theatre-red focus:border-theatre-red"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={submitMutation.isPending}
            className="w-full bg-theatre-red hover:bg-red-700 text-white font-semibold py-3 px-6 transition-all duration-300 transform hover:scale-[1.02]"
          >
            {submitMutation.isPending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verzenden...
              </div>
            ) : (
              <div className="flex items-center">
                <Send className="w-4 h-4 mr-2" />
                Verstuur Bericht
              </div>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
