
package golubeva.com;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

// tag::code[]

public interface SourceRepository extends PagingAndSortingRepository<Source, Long> {
    List<Source> findByName(@Param("name") String name);

}
// end::code[]
