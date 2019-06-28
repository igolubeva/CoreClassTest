
package golubeva.com;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.transaction.annotation.Transactional;


// tag::code[]
@Transactional(readOnly = true)
public interface SourceRepository extends PagingAndSortingRepository<Source, Long> {
    List<Source> findByName(@Param("name") String name);
    List<Source> findByNameContainingIgnoreCase(@Param("name") String name);

}
// end::code[]
