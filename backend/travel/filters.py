import operator
from functools import reduce
import django_filters
from django.db.models import Q
from .models import product

from transliterate import translit

def latin_to_armenian(word):
    try:
        return translit(word, 'hy')
    except Exception:
        return word


class TourPackageFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')
    lang = django_filters.CharFilter(field_name="lang", lookup_expr='exact')
    popular = django_filters.BooleanFilter(field_name="is_popular")
    
    search = django_filters.CharFilter(method='filter_by_search')

    class Meta:
        model = product
        fields = ['lang', 'popular', 'min_price', 'max_price','tag', 'search']

    def filter_by_search(self, queryset, name, value):
        words = value.strip().split()
        
        if not words:
            return queryset

        query_list = []
        for word in words:
            trans_word = latin_to_armenian(word)
            q = (Q(title__icontains=word) | Q(tag__icontains=word) | Q(search_keywords__icontains=word) | 
                 Q(title__icontains=trans_word) | Q(tag__icontains=trans_word) | Q(search_keywords__icontains=trans_word))
            if word.isdigit():
                q |= Q(rating=int(word))
                
            query_list.append(q)

        final_query = reduce(operator.and_, query_list)

        return queryset.filter(final_query).distinct()