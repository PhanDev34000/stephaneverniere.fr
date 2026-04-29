// =====================================================
// faq2.component.ts — PAGE PHOTOGRAPHE (optimisé SEO)
// =====================================================
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
      a: 'Bien sûr. Chaque projet photographique est unique. Je vous propose un devis sur mesure et gratuit, adapté à vos besoins et votre budget, que vous soyez un professionnel ou un particulier à Montpellier ou dans l\'Hérault.'
    },
    {
      q: 'Faut-il réserver longtemps à l\'avance ?',
      a: 'Pour garantir ma disponibilité, il est préférable de réserver dès que vous connaissez votre date — surtout pour les mariages et grands événements à Montpellier. Cela dit, selon mes disponibilités, une réservation de dernière minute est parfois possible, n\'hésitez pas à me contacter !'
    },
    {
      q: 'Retouchez-vous les photos ?',
      a: 'Oui, toutes les images livrées sont soigneusement sélectionnées et retouchées pour un rendu professionnel, naturel et harmonieux. La retouche fait partie intégrante de ma prestation de photographe à Montpellier.'
    },
    {
      q: 'Combien de temps faut-il pour recevoir les photos ?',
      a: 'En général, les photos sont livrées sous quelques jours à une semaine selon le type de prestation et le volume d\'images. Pour un mariage, comptez 2 semaines pour un travail de post-production soigné.'
    },
    {
      q: 'Comment récupère-t-on les photos après la séance ?',
      a: 'Une fois la post-production terminée (tri, recadrages, retouches), je vous envoie un identifiant et un mot de passe. Vous accédez ainsi à une galerie personnalisée et sécurisée sur ce site, où vous pouvez télécharger toutes vos photos en 1 clic !'
    },
    {
      q: 'Sous quel format livrez-vous les photos ?',
      a: 'Les photos sont livrées au format JPG, en haute définition, via une galerie en ligne privée et sécurisée. Des tirages papier ou albums peuvent être proposés en option selon vos souhaits.'
    },
    {
      q: 'Vous déplacez-vous en dehors de Montpellier ?',
      a: 'Oui ! Basé à Montpellier, j\'interviens dans tout l\'Hérault et l\'Occitanie : Nîmes, Béziers, Sète, Lunel, Palavas... Des déplacements plus lointains sont possibles selon vos besoins et la nature du projet.'
    },
    {
      q: 'Proposez-vous aussi des animations photo pour les événements ?',
      a: 'Absolument ! En complément de mes prestations de photographe, je propose la location de mon photobooth à Montpellier (voir page Photobooth) : élégant, en chêne massif, moderne et ludique. Vos invités repartent avec leurs tirages instantanés et peuvent recevoir leurs photos par email. Une animation originale qui garantit rires, souvenirs et convivialité !'
    },
    {
      q: 'Quelles sont vos spécialités en photographie ?',
      a: 'Je suis photographe spécialisé à Montpellier dans plusieurs domaines : photographie de mariage, reportage événementiel, photographie institutionnelle et corporate, portraits professionnels et personnels, ainsi que le packshot produit. Chaque prestation bénéficie de mon expertise et d\'un matériel professionnel.'
    }
  ];
}