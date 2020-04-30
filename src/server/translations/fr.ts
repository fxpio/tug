/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default {
    'validation.field.required': `Ce champs est requis`,

    'error.http.unauthorized.basic': `Vos informations d'identification ne sont pas valides`,
    'error.http.bad-request': `Mauvaise Demande`,
    'error.http.bad-request.validation': `Erreurs de validation`,
    'error.http.bad-request.invalid-json': `Le corps de votre requête n'est pas un JSON valide`,
    'error.http.too-many-requests': `Trop de demandes`,
    'error.http.not-found': `Ressource non trouvée`,
    'error.http.not-found.repository-branch': `La branche"{{name}}" est introuvable`,
    'error.http.not-found.repository-tag': `Le tag "{{name}}" est introuvable`,
    'error.http.not-found.repository': `Le dépôt avec l'url "{{url}}" est introuvable`,
    'error.http.not-supported.repository': `Le dépôt avec l'url "{{url}}" n'est pas supporté`,
    'error.http.internal-server': `Erreur interne du serveur`,

    'manager.repository.created': `Le dépôt "{{type}}" avec l'URL "{{url}}" a été activé avec succès`,
    'manager.repository.deleted': `Le dépôt avec l'URL "{{url}}" a été désactivé avec succès`,

    'manager.config.github-oauth.empty': `Aucun jeton pour Github Oauth n'est sauvegardé`,
    'manager.config.github-oauth': `Les jetons Oauth pour connecter le serveur avec votre compte Github sont "{{tokens}}"`,
    'manager.config.github-oauth.created': `Le jeton Oauth "{{token}}" pour connecter le serveur avec votre compte Github hébergé sur "{{host}}" a été créé avec succès`,
    'manager.config.github-oauth.deleted': `Le jeton Oauth pour connecter le serveur avec votre compte Github hébergé sur "{{host}}" a été supprimé avec succès`,
    'manager.config.github-token.empty': `Aucun jeton pour les Webhooks Github n'est généré`,
    'manager.config.github-token': `Les jetons pour pour les Webhooks Github sont "{{tokens}}"`,
    'manager.config.github-token.created': `Le jeton "{{token}}" pour les Webhooks Github hébergés sur "{{host}}" a été créé avec succès`,
    'manager.config.github-token.deleted': `Le jeton pour les Webhooks Github hébergés sur "{{host}}" a été supprimé avec succès`,

    'manager.api-key.created': `La clé API "{{token}}" a été créé avec succès`,
    'manager.api-key.deleted': `La clé API "{{token}}" a été supprimé avec succès`,

    'manager.package.refresh.versions.all-repositories': `L'actualisation de toutes les versions du paquet a démarré pour tous les dépôts`,
    'manager.package.refresh.versions': `L'actualisation de toutes les versions du paquet a démarré pour le dépôt "{{url}}"`,
    'manager.package.refresh.version': `L'actualisation de la version du paquet "{{version}}" a démarré pour le dépôt "{{url}}"`,
    'manager.package.delete.versions': `La suppression de tous les paquets a commencé pour le dépôt "{{url}}"`,
    'manager.package.delete.version': `La suppression de la version du paquet "{{version}}" a commencé pour le dépôt "{{url}}"`,
    'manager.package.refresh.cache.versions': `L'actualisation du cache de toutes les versions a commencé pour tous les paquets`,
    'manager.package.refresh.cache.version': `L'actualisation du cache de toutes les versions a commencé pour le paquet "{{packageName}}"`,
};
