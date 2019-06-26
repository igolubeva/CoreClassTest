
package golubeva.com;

import org.springframework.data.repository.PagingAndSortingRepository;

// tag::code[]
public interface SourceRepository extends PagingAndSortingRepository<Source, Long> {

}
// end::code[]
