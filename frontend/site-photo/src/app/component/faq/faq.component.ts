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
      q: 'Qu\'est-ce qu’un photobooth ?',
      a: 'Un photobooth est une borne photo interactive et autonome qui permet à vos invités de se prendre en photo en toute liberté. Moderne et ludique, il remplace le traditionnel photomaton en offrant bien plus de fonctionnalités : écran tactile, déclenchement automatique, impressions instantanées sur papier photo, et possibilité d’envoi des clichés par email. C’est l’animation idéale pour créer des souvenirs amusants et personnalisés lors de vos événements !'
    },
    {
      q: 'Combien de temps pour l’installation ?',
      a: 'Environ 10 à 15 minutes selon l’accès et la configuration du lieu.'
    },
    {
      q: 'Les tirages sont-ils illimités ?',
      a: 'La location inclut un pack de 400 tirages 10x15. Au-delà, il est possible d’ajouter des kits impression (75€/kit) que vous ne payerez que si vous l\'entamez !'
    },
    {
      q: 'Les envois par mail sont-ils illimités ?',
      a: 'Oui, il n\'y a aucune limite d\'envoi de mail !'
    },
     {
      q: 'Peut-on personnaliser les photos (logo, texte, couleurs) ?',
      a: 'Tout à fait ! Je peux personnaliser le gabarit des photos avec votre logo, un texte ou un visuel aux couleurs de votre événement.'
    },
    {
      q: 'Peut-on personnaliser les écrans de la borne ?',
      a: 'Oui ! Je peux personnaliser les différents écrans avec votre logo, un texte ou un visuel aux couleurs de votre événement. Il est d\'ailleurs conseillé d\'avoir une harmonie visuelle entre les écrans et les photos.'
    },
    {
      q: 'Sur place, de quoi a t\'on besoin pour installer la borne ?',
      a: 'Sur le lieu de la prestation, il faudra 1 m² au sol à l\'emplacement souhaité de la borne et une prise 220V à proximité. Aussi, pour l\'envoi des photos par email, il faudra le code wifi du lieu de votre événement.'
    },
    {
      q: 'Récupère-t-on les photos après l’événement ?',
      a: 'Maximum 48h aprés le retour de la borne, vous aurez la possibilité de télécharger toutes les photos réalisées lors de votre location. En effet, je vous enverrai un identifiant et mot de passe, que vous rentrerez sur ce site pour accéder de manière sécurisée à la page de téléchargement de votre galerie (en 1 clic) !'
    },
     {
      q: 'Est-ce que quelqu’un reste sur place pour gérer la borne ?',
      a: 'Non, mais le photobooth est entièrement autonome et simple d’utilisation. Je l’installe, je vous explique son fonctionnement, puis vous êtes libres de l’utiliser sans contrainte.'
    },
     {
      q: 'Et si jamais il y a un souci technique pendant l’événement ?',
      a: 'Le matériel est fiable, mais en cas de problème je reste joignable et disponible pour intervenir rapidement.'
    },
    
  ];
}
