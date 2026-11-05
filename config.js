/*
 * Site configuration: the ONLY place that names another site.
 *
 * ESTIME_URL is the address of the Estimé product site (its own repository,
 * newco-studio/estime). Every "Estimé" link on this site reads it at load time
 * (elements with data-ext="ESTIME_URL"). When the Estimé site moves to its own
 * domain, change this value and nothing else. Keep the trailing slash.
 */
window.SITE_CONFIG = {
  ESTIME_URL: 'https://newco-studio.github.io/estime/'
};
