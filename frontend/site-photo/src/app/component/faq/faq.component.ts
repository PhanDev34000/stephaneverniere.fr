// =====================================================
// faq.component.ts — PAGE PHOTOBOOTH (optimisé SEO)
// =====================================================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  faqs = [
    {
      q: 'Qu\'est-ce qu\'un photobooth ?',
      a: 'Un photobooth est une borne photo interactive et autonome qui permet à vos invités de se prendre en photo en toute liberté. Moderne et ludique, il remplace le traditionnel photomaton en offrant bien plus de fonctionnalités : écran tactile, déclenchement automatique, impressions instantanées sur papier photo, et envoi des clichés par email. C\'est l\'animation idéale pour créer des souvenirs amusants et personnalisés lors de vos événements à Montpellier et dans toute la région !'
    },
    {
      q: 'Dans quelle zone géographique intervenez-vous pour la location de photobooth ?',
      a: 'Je suis basé à Montpellier et j\'interviens dans tout l\'Hérault et l\'Occitanie : Nîmes, Béziers, Sète, Lunel, Palavas, Clermont-l\'Hérault... Pour les événements plus éloignés, n\'hésitez pas à me contacter, des déplacements plus lointains sont possibles selon disponibilités.'
    },
    {
      q: 'Combien de temps faut-il pour installer le photobooth ?',
      a: 'L\'installation du photobooth prend environ 10 à 15 minutes selon l\'accès et la configuration du lieu.'
    },
    {
      q: 'Les tirages sont-ils illimités ?',
      a: 'La location de photobooth inclut un pack de 400 tirages 10x15. Au-delà, il est possible d\'ajouter des kits impression (75€/kit) que vous ne payerez que si vous l\'entamez !'
    },
    {
      q: 'Les envois par mail sont-ils illimités ?',
      a: 'Oui, il n\'y a aucune limite d\'envoi par email ! Vos invités peuvent envoyer leurs photos directement depuis la borne, sans restriction de nombre.'
    },
    {
      q: 'Peut-on personnaliser les photos (logo, texte, couleurs) ?',
      a: 'Tout à fait ! Je personnalise le gabarit des photos avec votre logo, un texte ou un visuel aux couleurs de votre événement — mariage, soirée d\'entreprise, anniversaire... Votre photobooth à Montpellier sera unique et parfaitement à votre image.'
    },
    {
      q: 'Peut-on personnaliser les écrans de la borne ?',
      a: 'Oui ! Les différents écrans peuvent être personnalisés avec votre logo, un texte ou un visuel aux couleurs de votre événement. Il est d\'ailleurs conseillé d\'avoir une harmonie visuelle entre les écrans et les photos pour un résultat professionnel.'
    },
    {
      q: 'De quoi a-t-on besoin sur place pour installer la borne ?',
      a: 'Sur le lieu de la prestation, il faut prévoir 1 m² au sol à l\'emplacement souhaité et une prise 220V à proximité. Pour l\'envoi des photos par email, le code WiFi du lieu sera nécessaire.'
    },
    {
      q: 'Récupère-t-on les photos après l\'événement ?',
      a: 'Oui ! Dans les 48h suivant le retour de la borne, vous recevrez un identifiant et un mot de passe pour accéder à une galerie privée et sécurisée sur ce site. Vous pourrez télécharger toutes vos photos en 1 clic !'
    },
    {
      q: 'Que se passe-t-il en cas de problème technique pendant l\'événement ?',
      a: 'Le matériel est fiable et testé avant chaque prestation. En cas de souci, je reste joignable et disponible pour intervenir rapidement. Votre événement à Montpellier se déroulera sans stress !'
    },
  ];
}