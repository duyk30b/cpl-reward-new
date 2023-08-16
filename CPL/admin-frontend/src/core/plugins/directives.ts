import numberDirective from '@/core/directives/number.directive'

export default function initDirectives(app) {
  app.directive('number', numberDirective)
}
