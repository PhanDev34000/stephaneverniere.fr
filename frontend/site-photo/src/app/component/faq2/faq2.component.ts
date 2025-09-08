import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq2.component.html',
  styleUrls: ['./faq2.component.scss']
})
export class Faq2Component {
  faqs = [
    {
      q: 'Proposez-vous des devis personnalisés ?',
      a: 'Bien sûr. Chaque projet est unique, je vous propose un devis sur mesure en fonction de vos besoins et de votre budget.'
    },
    {
      q: 'Faut-il réserver longtemps à l’avance ?',
      a: 'Pour garantir la disponibilité, il est préférable de réserver dès que vous connaissez votre date, surtout pour les mariages et grands événements. Cependant, en fonction de mes disponibilités, une réservation peut être faite au dernier moment !'
    },
    {
      q: 'Retouchez-vous les photos ?',
      a: 'Oui, toutes les images livrées sont sélectionnées et retouchées pour un rendu professionnel, naturel et harmonieux.'
    },
    {
      q: 'Combien de temps faut-il pour recevoir les photos ?',
      a: 'En général, les photos sont livrées sous quelques jours à une semaine, selon le type de prestation et le volume d’images.'
    },
    {
      q: 'Comment récupère-t-on les photos après l’événement ?',
      a: 'Une fois le travail de post-production terminée (tris, recadrages, retouches...), je vous enverrai un identifiant et mot de passe que vous rentrerez sur ce site. Cela vous donnera l\'accés à une page personnalisée et sécurisée où vous pourrez télécharger votre galerie en 1 clic !'
    },
    {
      q: 'Sous quel format livrez-vous les photos ?',
      a: 'Les photos sont livrées au format .jpg, en version numérique HD, via une galerie en ligne sécurisée. Des tirages papier ou albums peuvent être proposés en option.'
    },    
    {
      q: 'Vous déplacez-vous ?',
      a: 'Je suis basé à Montpellier et j’interviens dans toute la région, avec possibilité de déplacements plus lointains selon vos besoins.'
    },
    {
      q: 'Proposez-vous aussi des animations photos pour les événements ?',
      a: 'Absolument ! J’anime vos soirées avec mon Photobooth (cf page \'Photobooth\') : élégant, moderne et ludique. Vos invités pourront se prendre en photo, et repartir avec leurs tirages instantanés et même recevoir leurs clichés par email. Une animation originale qui garantit rires, souvenirs et convivialité !'
    }
  ];
 
}